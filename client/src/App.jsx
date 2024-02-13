import { useState } from "react";
import "./App.css";
import websites from "./constants";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";

function App() {
  const [website, setWebsite] = useState("");
  const [falconSummary, setFalconSummary] = useState(
    "Click on Generate Output to see the summary"
  );
  const [pegasusSummary, setPegasusSummary] = useState(
    "Click on Generate Output to see the summary"
  );
  const [falconDistilSentiment, setFalconDistilSentiment] = useState([]);
  const [falconAuditorSentiment, setFalconAuditorSentiment] = useState([]);
  const [pegasusDistilSentiment, setPegasusDistilSentiment] = useState([]);
  const [pegasusAuditorSentiment, setPegasusAuditorSentiment] = useState([]);
  const [falconBPMN, setFalconBPMN] = useState([]);
  const [pegasusBPMN, setPegasusBPMN] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setWebsite(event.target.value);
    setErr("");
  };

  const generateOutput = async (event) => {
    event.preventDefault();
    if (website === "") {
      setErr("Please select a website");
    } else {
      try {
        setLoading(true);
        const response = await axios({
          method: "post",
          url: "http://localhost:5000/generateReport",
          data: {
            url: website,
          },
        });
        console.log(response.data);
        const data = response.data;
        setFalconSummary(data.summary_falcon);
        setPegasusSummary(data.summary_pegasus);
        if (data.sentiment_distil_falcon.length != 0) {
          setFalconDistilSentiment(data.sentiment_distil_falcon);
        }
        if (data.sentiment_auditor_falcon.length != 0) {
          setFalconAuditorSentiment(data.sentiment_auditor_falcon);
        }
        if (data.sentiment_distil_pegasus.length != 0) {
          setPegasusDistilSentiment(data.sentiment_distil_pegasus);
        }
        if (data.sentiment_auditor_pegasus.length != 0) {
          setPegasusAuditorSentiment(data.sentiment_auditor_pegasus);
        }
        setFalconBPMN(data.bpmn_info_falcon);
        setPegasusBPMN(data.bpmn_info_pegasus);
      } catch (err) {
        console.log(err);
        alert("Error in fetching data");
      } finally {
        setLoading(false);
      }
    }
    console.log(website);
  };

  return (
    <div className="bg-[#dedede] min-h-screen text-[#1f1f1f] flex items-center flex-col justify-center pb-20">
      <div className="mt-10 mb-10 w-[50vw]">
        <FormControl
          fullWidth
          sx={{
            backgroundColor: "#dedede",
            tableLayout: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <InputLabel>Website</InputLabel>
          <Select value={website} onChange={handleChange} fullWidth>
            {websites.map((website, index) => (
              <MenuItem key={index} value={website.url}>
                {website.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            sx={{ width: "25vw" }}
            onClick={generateOutput}
          >
            Generate Output
          </Button>
          <Typography variant="p" sx={{ color: "#de5d5d" }}>
            {err}
          </Typography>
          <div className={`buffer ${loading ? "block" : "hidden"}`}></div>
          <Typography
            variant="subtitle2"
            className={`${loading ? "block" : "hidden"}`}
          >
            This may take upto 5 minutes
          </Typography>
        </FormControl>
      </div>
      <div className="flex md:flex-row flex-col gap-10 md:gap-0 justify-between w-full px-20">
        <div className="flex flex-col gap-10 md:max-w-[30%] max-w-full">
          <div className="flex flex-col gap-2">
            <Typography variant="h6" component="div">
              Summary from{" "}
              <a
                href="https://huggingface.co/Falconsai/text_summarization"
                target="_blank"
                className="text-[#628fbf]"
              >
                {" "}
                Falconsai Text Summarizer{" "}
              </a>
            </Typography>
            <Typography variant="p">{falconSummary}</Typography>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="h6">
              Sentiment Analysis using{" "}
              <a
                href="https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis"
                target="_blank"
                className="text-[#628fbf]"
              >
                Distilroberta Financial News Sentiment Analyser
              </a>
            </Typography>
            <div>
              {falconDistilSentiment.length === 0 ? (
                "No Output Available"
              ) : (
                <div className="flex flex-col gap-1">
                  <Typography>
                    {falconDistilSentiment[0] && falconDistilSentiment[0][0]
                      ? `${falconDistilSentiment[0][0]["label"]}:${falconDistilSentiment[0][0]["score"]}`
                      : "No Output"}
                  </Typography>
                  <Typography>
                    {falconDistilSentiment[0] && falconDistilSentiment[0][1]
                      ? `${falconDistilSentiment[0][1]["label"]}:${falconDistilSentiment[0][1]["score"]}`
                      : "No Output"}
                  </Typography>
                  <Typography>
                    {falconDistilSentiment[0] && falconDistilSentiment[0][2]
                      ? `${falconDistilSentiment[0][2]["label"]}:${falconDistilSentiment[0][2]["score"]}`
                      : "No Output"}
                  </Typography>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="h6">
              Sentiment Analysis using{" "}
              <a
                href="https://huggingface.co/FinanceInc/auditor_sentiment_finetuned"
                target="_blank"
                className="text-[#628fbf]"
              >
                FinanceInc Auditor Sentiment Analysis
              </a>
            </Typography>
            <div>
              {falconAuditorSentiment.length === 0 ? (
                "No Output Available"
              ) : (
                <div className="flex flex-col gap-1">
                  <Typography>
                    {falconAuditorSentiment[0] && falconAuditorSentiment[0][0]
                      ? `${falconAuditorSentiment[0][0]["label"]}:${falconAuditorSentiment[0][0]["score"]}`
                      : "No Output"}
                  </Typography>
                  <Typography>
                    {falconAuditorSentiment[0] && falconAuditorSentiment[0][1]
                      ? `${falconAuditorSentiment[0][1]["label"]}:${falconAuditorSentiment[0][1]["score"]}`
                      : "No Output"}
                  </Typography>
                  <Typography>
                    {falconAuditorSentiment[0] && falconAuditorSentiment[0][2]
                      ? `${falconAuditorSentiment[0][2]["label"]}:${falconAuditorSentiment[0][2]["score"]}`
                      : "No Output"}
                  </Typography>
                </div>
              )}
            </div>
          </div>
          <div>
            <Typography variant="h6">
              Information Extraction using{" "}
              <a
                href="https://huggingface.co/jtlicardo/bpmn-information-extraction"
                target="_blank"
                className="text-[#628fbf]"
              >
                BPMN Information Extraction
              </a>
            </Typography>
            <div>
              {Array.isArray(falconBPMN) && falconBPMN.length === 0 ? (
                "No Output Available"
              ) : (
                <div className="flex flex-col gap-1">
                  {Array.isArray(falconBPMN)
                    ? falconBPMN.map((item, index) => (
                        <div key={index}>
                          <Typography>
                            Entity group: {item.entity_group}
                          </Typography>
                          <Typography>Score: {item.score}</Typography>
                          <Typography>Word: {item.word}</Typography>
                        </div>
                      ))
                    : "Invalid data format. Expected an array."}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10 md:max-w-[30%] max-w-full">
          <div className="flex flex-col gap-2">
            <Typography variant="h6" component="div">
              Summary from{" "}
              <a
                href="https://huggingface.co/human-centered-summarization/financial-summarization-pegasus"
                target="_blank"
                className="text-[#628fbf]"
              >
                Pegasus Financial Text Summarizer
              </a>
            </Typography>
            <Typography variant="p">{pegasusSummary}</Typography>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="h6">
              Sentiment Analysis using{" "}
              <a
                href="https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis"
                target="_blank"
                className="text-[#628fbf]"
              >
                Distilroberta Financial News Sentiment Analyser
              </a>
            </Typography>
            <div>
              {pegasusDistilSentiment.length === 0 ? (
                "No Output Available"
              ) : (
                <div className="flex flex-col gap-1">
                  <Typography>
                    {pegasusDistilSentiment[0] && pegasusDistilSentiment[0][0]
                      ? `${pegasusDistilSentiment[0][0]["label"]}:${pegasusDistilSentiment[0][0]["score"]}`
                      : "No Output"}
                  </Typography>
                  <Typography>
                    {pegasusDistilSentiment[0] && pegasusDistilSentiment[0][1]
                      ? `${pegasusDistilSentiment[0][1]["label"]}:${pegasusDistilSentiment[0][1]["score"]}`
                      : "No Output"}
                  </Typography>
                  <Typography>
                    {pegasusDistilSentiment[0] && pegasusDistilSentiment[0][2]
                      ? `${pegasusDistilSentiment[0][2]["label"]}:${pegasusDistilSentiment[0][2]["score"]}`
                      : "No Output"}
                  </Typography>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="h6">
              Sentiment Analysis using{" "}
              <a
                href="https://huggingface.co/FinanceInc/auditor_sentiment_finetuned"
                target="_blank"
                className="text-[#628fbf]"
              >
                FinanceInc Auditor Sentiment Analysis
              </a>
            </Typography>
            <div>
              {pegasusAuditorSentiment.length === 0 ? (
                "No Output Available"
              ) : (
                <div className="flex flex-col gap-1">
                  <Typography>
                    {pegasusAuditorSentiment[0] && pegasusAuditorSentiment[0][0]
                      ? `${pegasusAuditorSentiment[0][0]["label"]}:${pegasusAuditorSentiment[0][0]["score"]}`
                      : "No Output"}
                  </Typography>
                  <Typography>
                    {pegasusAuditorSentiment[0] && pegasusAuditorSentiment[0][1]
                      ? `${pegasusAuditorSentiment[0][1]["label"]}:${pegasusAuditorSentiment[0][1]["score"]}`
                      : "No Output"}
                  </Typography>
                  <Typography>
                    {pegasusAuditorSentiment[0] && pegasusAuditorSentiment[0][2]
                      ? `${pegasusAuditorSentiment[0][2]["label"]}:${pegasusAuditorSentiment[0][2]["score"]}`
                      : "No Output"}
                  </Typography>
                </div>
              )}
            </div>
          </div>
          <div>
            <Typography variant="h6">
              Information Extraction using{" "}
              <a
                href="https://huggingface.co/jtlicardo/bpmn-information-extraction"
                target="_blank"
                className="text-[#628fbf]"
              >
                BPMN Information Extraction
              </a>
            </Typography>
            <div>
              {Array.isArray(pegasusBPMN) && pegasusBPMN.length === 0 ? (
                "No Output Available"
              ) : (
                <div className="flex flex-col gap-1">
                  {Array.isArray(pegasusBPMN)
                    ? pegasusBPMN.map((item, index) => (
                        <div key={index}>
                          <Typography>
                            Entity group: {item.entity_group}
                          </Typography>
                          <Typography>Score: {item.score}</Typography>
                          <Typography>Word: {item.word}</Typography>
                        </div>
                      ))
                    : "No Output"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
