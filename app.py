from flask import Flask, render_template, request, flash, redirect, url_for
import re

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production

# Simple fake news detection logic (placeholder)
def detect_fake_news(text):
    """
    Simple fake news detection based on basic patterns.
    In a real app, you'd use ML models or external APIs.
    """
    if not text or len(text.strip()) < 10:
        return {"prediction": "insufficient_data", "confidence": 0}
    
    # Simple keyword-based detection (for demo purposes)
    fake_indicators = [
        'shocking', 'unbelievable', 'doctors hate this', 'you won\'t believe',
        'secret that', 'they don\'t want you to know', 'breaking news',
        'urgent', 'viral', 'must read'
    ]
    
    text_lower = text.lower()
    fake_score = sum(1 for indicator in fake_indicators if indicator in text_lower)
    
    # Simple scoring system
    confidence = min(fake_score * 15, 85)
    
    if fake_score >= 3:
        prediction = "likely_fake"
    elif fake_score >= 1:
        prediction = "suspicious"
    else:
        prediction = "likely_real"
    
    return {"prediction": prediction, "confidence": confidence}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    news_text = request.form.get('news_text', '').strip()
    
    if not news_text:
        flash('Please enter some news text to analyze.', 'error')
        return redirect(url_for('index'))
    
    # Analyze the text
    result = detect_fake_news(news_text)
    
    return render_template('index.html', 
                         result=result, 
                         analyzed_text=news_text)

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/contact', methods=['POST'])
def contact_submit():
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    message = request.form.get('message', '').strip()
    
    # Basic validation
    if not all([name, email, message]):
        flash('Please fill in all fields.', 'error')
        return render_template('contact.html')
    
    # Basic email validation
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        flash('Please enter a valid email address.', 'error')
        return render_template('contact.html')
    
    # In a real app, you'd save to database or send email
    flash('Thank you for your message! We\'ll get back to you soon.', 'success')
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)