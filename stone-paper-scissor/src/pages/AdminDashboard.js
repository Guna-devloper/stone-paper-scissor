import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { Modal, Button } from 'react-bootstrap';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function AdminDashboard() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('stationery');
  const [products, setProducts] = useState([]);
  const [base64, setBase64] = useState('');
  const [loading, setLoading] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  // Bulk Upload States
  const [excelData, setExcelData] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, 'products'));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !price || !base64) return alert('Please fill all fields and crop image.');
    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        category,
        imageBase64: base64,
      });
      alert('✅ Product added!');
      setName('');
      setPrice('');
      setCategory('stationery');
      setBase64('');
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('❌ Error adding product');
    }
    setLoading(false);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      setBase64(croppedImg);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setExcelData(json);
      alert("✅ Excel data loaded. Now upload images.");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkUpload = async () => {
    if (!excelData.length || !imageFiles.length) {
      return alert('Please upload both Excel and image files');
    }

    setLoading(true);
    try {
      for (let row of excelData) {
        const { name, price, category, imageFileName } = row;
        if (!name || !price || !category || !imageFileName) continue;

        const matchingFile = imageFiles.find(file => file.name === imageFileName);
        let imageBase64 = '';

        if (matchingFile) {
          imageBase64 = await convertFileToBase64(matchingFile);
        }

        await addDoc(collection(db, 'products'), {
          name,
          price: parseFloat(price),
          category: category.toLowerCase(),
          imageBase64,
        });
      }

      alert('✅ Bulk Upload Complete!');
      setExcelData([]);
      setImageFiles([]);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('❌ Bulk Upload Failed');
    }
    setLoading(false);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(products.map(p => ({
      name: p.name,
      price: p.price,
      category: p.category,
      imageBase64: p.imageBase64 || '',
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'products.csv');
  };

  return (
    <div className="container mt-4">

      {/* Cropper Modal */}
      <Modal show={showCropper} onHide={() => setShowCropper(false)} centered size="lg">
        <Modal.Body style={{ height: '400px', position: 'relative' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCropper(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCropConfirm}>Crop & Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Manual Add */}
      <div className="card shadow-sm p-4 mx-auto mb-4" style={{ maxWidth: 500 }}>
        <h4 className="mb-3 text-primary text-center">📦 Add Product Manually</h4>
        <form onSubmit={handleAdd}>
          <input className="form-control mb-2" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="form-control mb-2" type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <select className="form-select mb-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="stationery">Stationery</option>
            <option value="electrical">Electrical</option>
            <option value="fashion">Fashion</option>
            <option value="gifts">Gifts</option>
            <option value="fancy">Fancy</option>
          </select>
          <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
          {base64 && <img src={base64} alt="Preview" className="img-thumbnail mt-2" style={{ height: 120 }} />}
          <button className="btn btn-success w-100 mt-3" type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* Bulk Upload */}
      <div className="card shadow-sm p-4 mx-auto mb-4" style={{ maxWidth: 600 }}>
        <h5 className="text-primary mb-3 text-center">📥 Bulk Upload (Excel + Images)</h5>
        <div className="row g-2">
          <div className="col-md-6">
            <input type="file" accept=".xlsx" className="form-control" onChange={handleExcelUpload} />
            <small className="text-muted">Excel: name, price, category, imageFileName</small>
          </div>
          <div className="col-md-6">
            <input type="file" accept="image/*" className="form-control" multiple onChange={(e) => setImageFiles([...e.target.files])} />
            <small className="text-muted">Images should match filenames in Excel</small>
          </div>
        </div>
        <button className="btn btn-primary w-100 mt-3" onClick={handleBulkUpload} disabled={loading}>
          {loading ? 'Uploading...' : '📤 Start Bulk Upload'}
        </button>
      </div>

      {/* Export */}
      <div className="text-center mb-3">
        <button onClick={exportToCSV} className="btn btn-outline-primary">
          📤 Export Products to CSV
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <h5 className="text-primary mb-3">🗂️ All Products</h5>
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, i) => (
              <tr key={prod.id}>
                <td>{i + 1}</td>
                <td><img src={prod.imageBase64} alt={prod.name} style={{ height: 60 }} /></td>
                <td>{prod.name}</td>
                <td>₹{prod.price}</td>
                <td>{prod.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
