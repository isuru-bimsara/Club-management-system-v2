import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ label, error, onChange, value, maxSizeMB = 5, accept = "image/jpeg, image/png", className = '' }) => {
  const [preview, setPreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (typeof value === 'string' && value.startsWith('http')) {
      setPreview(value);
    } else if (value && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(value);
      setFileName(value.name);
    } else if (!value) {
      setPreview('');
      setFileName('');
    }
  }, [value]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (!file) return false;
    
    // Check type if accept is provided (simple string matching logic for our use cases)
    if (accept) {
      const validTypes = accept.split(',').map(t => t.trim());
      const isValidType = validTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type || file.name.endsWith(type);
      });
      if (!isValidType) {
        alert('Invalid file type');
        return false;
      }
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File is too large. Max size is ${maxSizeMB}MB.`);
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onChange(file);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onChange(file);
      } else {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    setPreview('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isPdf = preview && preview.startsWith('data:application/pdf') || (value && typeof value === 'string' && value.endsWith('.pdf'));

  return (
    <div className={`mb-4 w-full ${className}`}>
      {label && <label className="label-text">{label}</label>}
      
      <div 
        className={`relative mt-1 flex justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-dark-300 bg-dark-50 hover:bg-dark-100'}
          ${error ? 'border-red-500 bg-red-50' : ''}
          ${preview ? 'p-2' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !preview && fileInputRef.current?.click()}
      >
        <input
          type="file"
          className="sr-only"
          ref={fileInputRef}
          onChange={handleChange}
          accept={accept}
        />
        
        {preview ? (
          <div className="relative w-full overflow-hidden rounded-lg">
            {isPdf ? (
              <div className="flex flex-col items-center justify-center py-10 bg-dark-100">
                <ImageIcon className="h-12 w-12 text-dark-400 mb-2" />
                <span className="text-sm font-medium">{fileName || 'PDF Document'}</span>
              </div>
            ) : (
              <img src={preview} alt="Preview" className="w-full object-cover max-h-64 rounded-lg" />
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Change
              </button>
              <button
                type="button"
                className="btn btn-danger transition-colors rounded-full p-2"
                onClick={handleClear}
                title="Remove image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-dark-400" aria-hidden="true" />
            <div className="mt-4 flex text-sm leading-6 text-dark-600 justify-center">
              <span className="relative font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
                Upload a file
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-dark-500 mt-1">
              Supports {accept.split(',').map(s=>s.replace('image/','').replace('application/','')).join(', ')}. Max {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUpload;
