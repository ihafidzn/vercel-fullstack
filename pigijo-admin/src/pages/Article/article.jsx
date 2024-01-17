import React, { useState, useEffect } from "react";
import "./article-style.css";
import Navbar from "../../component/Navbar/navbar";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { toast } from "react-toastify";
import trash from "../../assets/logo/trash.svg";
import axios from "axios";

const Article = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [imageCover, setImageCover] = useState("");

  const [articles, setArticles] = useState([]);
  const [titleID, setTitleID] = useState("");
  const [titleEN, setTitleEN] = useState([]);
  const [descriptionID, setDescriptionID] = useState([]);
  const [descriptionEN, setDescriptionEN] = useState([]);
  const [articleDate, setArticleDate] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_REACT_APP_ARTICLE_GET)
      .then((response) => {
        console.log(response.data);
        setArticles(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleRadioChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const localCreatedAt = currentDate.toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    });
    console.log("Axios Request Payload", {
      titleID,
      titleEN,
      descriptionID,
      descriptionEN,
      articleDate,
      category,
      imageCover,
    });

    axios
      .post(import.meta.env.VITE_APP_ARTICLE, {
        titleID,
        titleEN,
        descriptionID,
        descriptionEN,
        articleDate,
        category,
        createdAt: localCreatedAt,
        imageCover,
      })
      .then((result) => {
        console.log(result);

        toast.success("Success Add Article!");
        axios
          .get(import.meta.env.VITE_REACT_APP_ARTICLE_GET)
          .then((response) => {
            console.log(response.data);
            setArticles(response.data);
          })
          .catch((err) => console.log(err));

        setTitleID("");
        setTitleEN("");
        setDescriptionID("");
        setDescriptionEN("");
        setArticleDate("");
        setCategory("");
        setImageCover("");
        // window.location.reload();
      })
      .catch((error) => {
        console.error(
          "Server Error:",
          error.response ? error.response.data : error.message
        );
        if (error.response && error.response.status === 500) {
          window.location.reload();
        }
      });
  };

  const handleDeleteImage = () => {
    setSelectedFile(null);
    setImageCover("");
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      setImageCover("");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile(e.target.files[0]);
      setImageCover(reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  // const handleRowClick = (articleId) => {
  //   setSelectedDocumentId(articleId);
  // };

  const handleDelete = async (articleId) => {
    try {
      if (!articleId) {
        alert("Select a article to delete first.");
        return;
      }
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this article?"
      );
      if (!confirmDelete) {
        return;
      }
      await axios.delete(`${import.meta.env.VITE_APP_ARTICLE}${articleId}`);
      console.log("Article deleted successfully!");
      toast.warning("Success Delete Article");
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_ARTICLE_GET
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error deleting article:", error);
      if (error.response && error.response.status === 500) {
        window.location.reload();
      }
    }
  };
  return (
    <>
      <Navbar />
      <section className="container module-header">
        <Accordion>
          <AccordionSummary
            id="panel1-header"
            aria-control="panel1-content"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="fw-bolder">Create New Data</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <form action="" onSubmit={handleSubmit}>
                <div className="form-group row">
                  <label
                    htmlFor="titleID"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Title ID
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="titleID"
                      placeholder="e.g: Perusahaan Pigijo"
                      // value={formData.titleID}
                      onChange={(e) => setTitleID(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="titleEN"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Title EN
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      id="titleEN"
                      placeholder="e.g: Perusahaan Pigijo"
                      // value={formData.titleEN}
                      onChange={(e) => setTitleEN(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="descriptionID"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Description ID
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      type="text"
                      className="form-control"
                      id="descriptionID"
                      placeholder=""
                      rows="4"
                      onChange={(e) => setDescriptionID(e.target.value)}
                      // value={formData.descriptionID}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="descriptionEN"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Description EN
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      type="text"
                      className="form-control"
                      id="descriptionEN"
                      placeholder=""
                      rows="4"
                      onChange={(e) => setDescriptionEN(e.target.value)}
                      // value={formData.descriptionEN}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="articleDate"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Article Date
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      className="form-control"
                      id="articleDate"
                      placeholder=""
                      onChange={(e) => setArticleDate(e.target.value)}
                      // value={formData.articleDate}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="imageUpload"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Image Cover
                  </label>
                  <div className="col-sm-8">
                    {selectedFile ? (
                      <div>
                        <img
                          src={imageCover}
                          alt="Preview"
                          style={{ width: "320px", height: "180px" }}
                        />
                        <button
                          className="btn btn-danger mt-2 ms-3"
                          onClick={handleDeleteImage}
                        >
                          {" "}
                          Delete{" "}
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        id="imageUpload"
                        onChange={onSelectFile}
                        requiredx
                      />
                    )}
                  </div>
                </div>
                <div className="form-group row mb-4">
                  <label htmlFor="Category" className="col-sm-4 col-form-label">
                    Category
                  </label>
                  <div className="col-sm-8">
                    <div className="form-check">
                      <input
                        type="radio"
                        value="INTERNAL"
                        id="internal"
                        name="category"
                        className="form-check-input custom-input"
                        onChange={handleRadioChange}
                        checked={category === "INTERNAL"}
                        required
                      />
                      <label htmlFor="internal" className="form-check-label">
                        Internal
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        value="PUBLIC"
                        id="public"
                        name="category"
                        className="form-check-input custom-input"
                        onChange={handleRadioChange}
                        checked={category === "PUBLIC"}
                      />
                      <label htmlFor="public" className="form-check-label">
                        Public
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor=""
                    className="col-sm-4 col-form-label text-right"
                  ></label>
                  <div className="col-sm-8">
                    <button className="btn btn-primary text-light btn-md px-3">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            id="panelDataTable-header"
            aria-control="panelDataTable-content"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="fw-bolder">Data Table</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <td>Title</td>
                      <td>Date</td>
                      <td>Category</td>
                      <td>Cover</td>
                      <td>Created At</td>
                      <td>Delete</td>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => {
                      return (
                        <tr key={article._id}>
                          <td>{article.titleID}</td>
                          <td>{article.articleDate}</td>
                          <td>{article.category}</td>
                          <td>
                            {article.imageCover && (
                              <img
                                src={article.imageCover}
                                alt="Cover"
                                style={{ maxWidth: "120px", maxHeight: "70px" }}
                              />
                            )}
                          </td>
                          <td>{article.createdAt}</td>
                          <td>
                            <img
                              src={trash}
                              alt=""
                              style={{
                                width: "25px",
                                height: "25px",
                                margin: "auto",
                                display: "block",
                                cursor: "pointer",
                              }}
                              onClick={() => handleDelete(article._id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </section>
    </>
  );
};

export default Article;
