from models import Models
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
import threading

app = Flask(__name__)
CORS(app)

def web_scraper(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text(separator=' ')
        return text
    else:
        print(f"Failed to fetch content from {url}")
        return None

def preprocess_text(text):
    stopWords = set(stopwords.words('english'))
    words = word_tokenize(text)
    wordsFiltered = [w for w in words if w not in stopWords]
    webpage_text = " ".join(wordsFiltered)
    webpage_text.replace(",", "")
    return webpage_text

@app.route('/generateReport', methods=['POST'])
def generateReport():
    data = request.json
    url = data['url']
    text = web_scraper(url)
    if text is None:
        return jsonify({"error": "Failed to fetch content from the URL"})
    text = preprocess_text(text)
    models = Models()
    
    summary_pegasus = models.pegasus_summarization(text)
    summary_pegasus = models.pegasus_summarization(text)
    summary_falcon = models.falconsai_summarization(text)
    summary_falcon = summary_falcon[0]['summary_text']
    summary_pegasus = summary_pegasus[0]['generated_text']
    sentiment_distil_pegasus = models.distilroberta_sentiment(summary_pegasus)
    sentiment_distil_pegasus = models.distilroberta_sentiment(summary_pegasus)
    sentiment_distil_falcon = models.distilroberta_sentiment(summary_falcon)
    sentiment_auditor_pegasus = models.auditor_sentiment(summary_pegasus)
    sentiment_auditor_pegasus = models.auditor_sentiment(summary_pegasus)
    sentiment_auditor_falcon = models.auditor_sentiment(summary_falcon)
    bpmn_info_pegasus = models.bpmn_info_extract(summary_pegasus)
    bpmn_info_pegasus = models.bpmn_info_extract(summary_pegasus)
    bpmn_info_falcon = models.bpmn_info_extract(summary_falcon)
    return jsonify({
        "summary_pegasus": summary_pegasus,
        "summary_falcon": summary_falcon,
        "sentiment_distil_pegasus": sentiment_distil_pegasus,
        "sentiment_distil_falcon": sentiment_distil_falcon,
        "sentiment_auditor_pegasus": sentiment_auditor_pegasus,
        "sentiment_auditor_falcon": sentiment_auditor_falcon,
        "bpmn_info_pegasus": bpmn_info_pegasus,
        "bpmn_info_falcon": bpmn_info_falcon
    })

if __name__ == '__main__':
    app.run(debug=True)
