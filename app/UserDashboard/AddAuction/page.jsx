"use client";
import { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ImageIcon from "@mui/icons-material/Image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const AddAuction = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        currentBid: "",
    });
    const [endTime, setEndTime] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("currentBid", formData.currentBid);
            if (endTime) {
                formDataToSend.append("timeRemaining", dayjs(endTime).toISOString());
            }
            if (imageFile) {
                formDataToSend.append("image", imageFile); // Append image file
            }

            const response = await fetch("/api/auctions", {
                method: "POST",
                body: formDataToSend, // Send FormData directly
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Auction added successfully!");
                router.push("/UserDashboard/Auctions");
            } else {
                setMessage("Failed to add auction.");
            }
        } catch (error) {
            setMessage("Error: Unable to add auction.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f5f5f5" }}>
            <Box sx={{ width: "100%", maxWidth: 400, padding: 4, backgroundColor: "white", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Add Item For Rent
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={3}>
                        <TextField label="Title" type="text" name="title" value={formData.title} onChange={handleChange} required fullWidth variant="outlined" />
                    </Box>
                    <Box mb={3}>
                        <TextField label="Description" type="text" name="description" value={formData.description} onChange={handleChange} required fullWidth variant="outlined" />
                    </Box>
                    <Box mb={3}>
                        <TextField label="Base Price" type="text" name="currentBid" value={formData.currentBid} onChange={handleChange} required fullWidth variant="outlined" />
                    </Box>
                    <Box mb={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Rent End Time"
                                value={endTime}
                                onChange={(newValue) => setEndTime(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth required />}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box mb={3}>
                        <Button variant="contained" component="label" fullWidth startIcon={<ImageIcon />}>
                            Upload Image
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100%", marginTop: "10px", borderRadius: "5px" }} />}
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: "10px", marginTop: "16px" }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Add Item"}
                    </Button>
                    {message && (
                        <Typography variant="body2" color={message.includes("successfully") ? "success.main" : "error.main"} align="center" sx={{ marginTop: "16px" }}>
                            {message}
                        </Typography>
                    )}
                </form>
            </Box>
        </Box>
    );
};

export default AddAuction;
