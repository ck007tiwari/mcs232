import { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Captures the file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Create a FormData object (Required for files)
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("pdf", file); // 'pdf' must match upload.single('pdf') in backend

    try {
      // 2. Send to your running backend
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Crucial header
        },
      });
      alert("Upload Successful!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      {/* File Input */}
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button type="submit">Upload PDF</button>
    </form>
  );
};

export default UploadForm;
