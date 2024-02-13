import nltk
from transformers import pipeline
import time
import requests
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("TOKEN")

nltk.download('punkt')
nltk.download('stopwords')
class Models:
    def __init__(self):
        self.summary = ""
        self.pegausus_summarization_url = "https://api-inference.huggingface.co/models/human-centered-summarization/financial-summarization-pegasus"
        self.distilroberta_sentiment_url = "https://api-inference.huggingface.co/models/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis"
        self.auditor_sentiment_url = "https://api-inference.huggingface.co/models/FinanceInc/auditor_sentiment_finetuned"
        self.bpmn_info_url = "https://api-inference.huggingface.co/models/jtlicardo/bpmn-information-extraction"
    
    def pegasus_summarization(self, text):
        headers = {"Authorization": f"Bearer {api_key}"}
        time.sleep(92)

        def query(payload):
            payload["parameters"] = {"truncation": "only_first"}
            response = requests.post(self.pegausus_summarization_url, headers=headers, json=payload)
            return response.json()
        
        output = query({
	        "inputs": text,
        })
        return output
    
    def falconsai_summarization(self, text):
        summarizer = pipeline("summarization", model="Falconsai/text_summarization")
        time.sleep(61)
        threshold = 0
        if len(text) > 3000:
            threshold = 3000
        else:
            threshold = len(text)//2
        webpage_text_to_summ = text[:threshold]
        output = summarizer(webpage_text_to_summ, max_length=230, min_length=30, do_sample=False)
        return output
    
    def distilroberta_sentiment(self, summary):
        headers = {"Authorization": f"Bearer {api_key}"}
        time.sleep(100)

        def query(payload):
            response = requests.post(self.distilroberta_sentiment_url, headers=headers, json=payload)
            print(response.json())
            return response.json()

        output = query({
            "inputs": summary
        })
        return output

    def auditor_sentiment(self, summary):
        headers = {"Authorization": f"Bearer {api_key}"}
        time.sleep(100)

        def query(payload):
            payload["inputs"] = payload["inputs"][:500]
            response = requests.post(self.auditor_sentiment_url, headers=headers, json=payload)
            print(response.json())
            return response.json()

        output = query({
            "inputs": summary,
        })
        return output

    def bpmn_info_extract(self, summary):
        headers = {"Authorization": f"Bearer {api_key}"}
        time.sleep(100)

        def query(payload):
            response = requests.post(self.bpmn_info_url, headers=headers, json=payload)
            print(response.json())
            return response.json()

        output = query({
            "inputs": summary,
        })
        return output

if __name__ == '__main__':
    print("Runs")