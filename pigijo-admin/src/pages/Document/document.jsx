import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import "./document-style.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ColorRing } from "react-loader-spinner";
import trash from "../../assets/logo/trash.svg";
import { toast } from "react-toastify";
import axios from "axios";

const Document = () => {
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState([]);
  // const [formData, setFormData] = useState({
  //   descriptionID: "",
  //   descriptionEN: "",
  //   fileDocument: null,
  //   articleDate: "",
  //   category: "",
  //   selectType: "",
  // });
  const [fileDocument, setFileDocument] = useState("");
  const [descriptionID, setDescriptionID] = useState([]);
  const [descriptionEN, setDescriptionEN] = useState([]);
  const [articleDate, setArticleDate] = useState([]);
  const [category, setCategory] = useState("");
  const [selectType, setSelectType] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_REACT_APP_DOCUMENT_GET)
      .then((response) => {
        console.log(response.data);
        setDocument(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const radioChangeCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileDocument(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("descriptionID", descriptionID);
    formData.append("descriptionEN", descriptionEN);
    formData.append("articleDate", articleDate);
    formData.append("category", category);
    formData.append("selectType", selectType);
    formData.append("fileDocument", fileDocument);

    const currentDate = new Date();
    formData.append("createdAt", currentDate.toISOString());
    try {
      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_MONGODB_DOCUMENT_POST,
        formData
      );
      toast.success("Success Add Document!");
      // window.location.reload();
      axios
        .get(import.meta.env.VITE_REACT_APP_DOCUMENT_GET)
        .then((response) => {
          console.log(response.data);
          setDocument(response.data);
        })
        .catch((err) => console.log(err));
      console.log(response.data);
      setDescriptionID("");
      setDescriptionEN("");
      setArticleDate("");
      setCategory("");
      setSelectType("");
      setFileDocument("");
    } catch (error) {
      console.error(
        "Server Error:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.status === 500) {
        // window.location.reload();
      }
    }
  };

  const handleRowClick = (documentId) => {
    setSelectedDocumentId(documentId);
  };

  const handleDelete = async (documentId) => {
    try {
      if (!documentId) {
        alert("Select a document to delete first.");
        return;
      }
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this document?"
      );
      if (!confirmDelete) {
        return;
      }
      await axios.delete(
        `${import.meta.env.VITE_APP_MONGODB_DOCUMENT}${documentId}`
      );
      console.log("Document deleted successfully!");
      toast.warning("Success Delete Document");
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_DOCUMENT_GET
      );
      setDocument(response.data);
    } catch (error) {
      console.error("Error deleting document:", error);
      if (error.response && error.response.status === 500) {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <Navbar />
      <section className="container">
        <Accordion>
          <AccordionSummary
            id="PanelHeader"
            aria-control="PanelHeader-content"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="fw-bolder">Create New Data</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <form action="" onSubmit={handleSubmit}>
                <div className="form-group row">
                  <label
                    htmlFor="DescriptionID"
                    className="col-sm-4 col-form-label"
                  >
                    Description ID
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      type="text"
                      className="form-control"
                      id="descriptionID"
                      placeholder="e.g: Perusahaan Pigijo"
                      rows="5"
                      onChange={(e) => setDescriptionID(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="DescriptionEN"
                    className="col-sm-4 col-form-label"
                  >
                    Description EN
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      type="text"
                      className="form-control"
                      id="descriptionEN"
                      placeholder="e.g: Perusahaan Pigijo"
                      rows="5"
                      onChange={(e) => setDescriptionEN(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="" className="col-sm-4 col-form-label">
                    File
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="file"
                      className="form-control"
                      id="fileDocument"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="ArticleDate"
                    className="col-sm-4 col-form-label text-right"
                  >
                    Article Date
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      className="form-control"
                      id="articleDate"
                      onChange={(e) => setArticleDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group row mb-4">
                  <label htmlFor="" className="col-sm-4 col-form-label">
                    Category
                  </label>
                  <div className="col-sm-8">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input custom-input"
                        type="radio"
                        name="category"
                        id="keterbukaanInformasi"
                        value="Keterbukaan Informasi"
                        onChange={radioChangeCategory}
                        checked={category === "Keterbukaan Informasi"}
                        required
                      ></input>
                      <label
                        className="form-check-label"
                        htmlFor="keterbukaanInformasi"
                      >
                        Keterbukaan Informasi
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input custom-input"
                        type="radio"
                        name="category"
                        id="keuangan"
                        value="Keuangan"
                        onChange={radioChangeCategory}
                        checked={category === "Keuangan"}
                      ></input>
                      <label className="form-check-label " htmlFor="keuangan">
                        Keuangan
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group row mb-4">
                  <label
                    htmlFor="selectType"
                    className="col-sm-4 col-form-label"
                  >
                    Type
                  </label>
                  <div className="col-sm-8">
                    <select
                      className="form-control selectType"
                      id="selectType"
                      row="5"
                      placeholder="Pilih type"
                      value={selectType}
                      onChange={(e) => setSelectType(e.target.value)}
                      required
                    >
                      <option>SELECT</option>
                      <option>Keterbukaan Informasi</option>
                      <option>Keuangan</option>
                      <option>Laporan Keuangan</option>
                      <option>Laporan Tahunan</option>
                      <option>Rapat Umum Pemegang Saham</option>
                      <option>Siaran Pers</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="" className="col-sm-4 col-form-label"></label>
                  <div className="col-sm-8">
                    <button
                      className="btn btn-primary text-light px-3"
                      type="submit"
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              </form>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            id="header-table"
            aria-control="table-content"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className="fw-bolder">Data Table</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <td>Document date</td>
                      <td>Description</td>
                      <td>Category</td>
                      <td>Type</td>
                      <td>File</td>
                      <td>Created At</td>
                      <td>Delete</td>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <ColorRing
                        visible={true}
                        height={80}
                        width={80}
                        ariaLabel="blocks-loading"
                        wrapperStyle={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          text: "center",
                        }}
                        wrapperClass="blocks-wrapper"
                        colors={[
                          "#e15b64",
                          "#f47e60",
                          "#f8b26a",
                          "#abbd81",
                          "#849b87",
                        ]}
                      />
                    ) : (
                      document.map((document) => {
                        const fileURL = `${
                          import.meta.env.VITE_APP_MONGODB_DOCUMENT
                        }${document.fileDocument.name}`;
                        return (
                          <tr
                            key={document._id}
                            onClick={() => handleRowClick(fileURL)}
                          >
                            <td>{document.articleDate}</td>
                            <td>{document.descriptionID}</td>
                            <td>{document.category}</td>
                            <td>{document.selectType}</td>
                            <td>
                              <a
                                href={`${
                                  import.meta.env.VITE_APP_MONGODB_DOCUMENT
                                }${document.fileDocument.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                              >
                                Download PDF
                              </a>
                            </td>
                            <td>{document.createdAt}</td>
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
                                onClick={() => handleDelete(document._id)}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
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

export default Document;
