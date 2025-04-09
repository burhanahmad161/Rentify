"use client";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// Category options
const categories = ["Electronics","Fashion" , "Vehicles", "Tools", "Furniture", "Others"];
const priceUnits = ["day","week","month"]

// Validation Schema
const validationSchema = Yup.object({
    title: Yup.string().required("Item title is required"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().typeError("Must be a number").required("Price is required"),
    priceUnit: Yup.string().required("Pricing unit is required"),
});

const AddItem = () => {
    const router = useRouter();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            title: "",
            category: "",
            description: "",
            price: "",
            priceUnit: priceUnits[0],
        },
        validationSchema,
        onSubmit: async (values) => {
            setMessage("");
            setLoading(true);
            try {
                const formDataToSend = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    formDataToSend.append(key, value);
                });
                if (imageFile) {
                    formDataToSend.append("image", imageFile);
                    const owner = localStorage.getItem('userId');
                    formDataToSend.append("userId",owner);
                }

                const response = await fetch("/api/auctions", {
                    method: "POST",
                    body: formDataToSend
                });

                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setMessage("Item added for rent successfully!");
                    router.push("/UserDashboard/Items");
                } else {
                    setMessage("Failed to add item.");
                }
            } catch (error) {
                setMessage("Error: Unable to add item.");
            } finally {
                setLoading(false);
            }
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", background: "#f5f5f5", py: 4 }}>
            <Box sx={{
                width: "100%",
                maxWidth: 700,
                backgroundColor: "white",
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                '& .MuiTextField-root': { marginBottom: 2 },
            }}>
                <Typography variant="h4" align="center" color="theme.palette.indigo" gutterBottom>
                    Add Item For Rent
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        label="Item Title"
                        name="title"
                        fullWidth
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title ? formik.errors.title || "A short name for the item" : "A short name for the item"}
                        variant="outlined"
                    />

                    <TextField
                        select
                        label="Category"
                        name="category"
                        fullWidth
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        error={formik.touched.category && Boolean(formik.errors.category)}
                        helperText={formik.touched.category ? formik.errors.category || "Choose from predefined types" : "Choose from predefined types"}
                        variant="outlined"
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        rows={3}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description ? formik.errors.description || "Detailed info: condition, usage, etc." : "Detailed info: condition, usage, etc."}
                        variant="outlined"
                    />

                    <TextField
                        label="Rental Price"
                        name="price"
                        fullWidth
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        error={formik.touched.price && Boolean(formik.errors.price)}
                        helperText={formik.touched.price ? formik.errors.price || "E.g. 15/day or 100/week" : "E.g. 15/day or 100/week"}
                        variant="outlined"
                    />

                    <TextField
                        select
                        label="Pricing Unit"
                        name="priceUnit"
                        fullWidth
                        value={formik.values.priceUnit}
                        onChange={formik.handleChange}
                        helperText="Per hour / day / week / month"
                        variant="outlined"
                    > 
                    {priceUnits.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                    </TextField>

                    <Box my={2}>
                        <Button variant="contained" component="label" fullWidth startIcon={<ImageIcon />} sx={{ backgroundColor: 'indigo.600' }}>
                            Upload Image
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100%", marginTop: "10px", borderRadius: "5px" }} />}
                    </Box>

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: "10px", backgroundColor: 'indigo.600' }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Add Item"}
                    </Button>

                    {message && (
                        <Typography variant="body2" color={message.includes("successfully") ? "success.main" : "error.main"} align="center" mt={2}>
                            {message}
                        </Typography>
                    )}
                </form>
            </Box>
        </Box>
    );
};

export default AddItem;