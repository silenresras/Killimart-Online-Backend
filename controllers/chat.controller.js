import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Training from '../models/trainingData.model.js';
import UntrainedQuestion from '../models/untrainedQuestion.model.js'

export const chatHandler = async (req, res) => {
    const { message, userId } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ reply: 'Invalid message' });
    }

    const lowerMsg = message.toLowerCase();

    try {
        // 1. Greet or respond to common phrases
        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon'];
        if (greetings.some(g => lowerMsg.includes(g))) {
            return res.json({ reply: 'Hi there! Welcome to SmartKenya 😊. How can I assist you today?' });
        }

        if (lowerMsg.includes('how are you') || lowerMsg.includes("what's up")) {
            return res.json({ reply: "I'm just a helpful assistant, but I'm doing great! 😊 How can I assist you today?" });
        }

        // 2. Handle order inquiries (if userId is sent)
        if (lowerMsg.includes('order') || lowerMsg.includes('my orders') || lowerMsg.includes('track')) {
            if (!userId) {
                return res.json({ reply: 'To check your orders, please log in or provide your order ID.' });
            }

            const orders = await Order.find({ user: userId });

            if (orders.length === 0) {
                return res.json({ reply: 'You have no orders at the moment.' });
            }

            const orderSummaries = orders.map((o, i) => `#${i + 1}: Order ID: ${o._id}, Status: ${o.status}`).join('\n');
            return res.json({ reply: `Here are your orders:\n${orderSummaries}` });
        }

        // 3. Product-related inquiries
        if (
            lowerMsg.includes('have') ||
            lowerMsg.includes('available') ||
            lowerMsg.includes('in stock') ||
            lowerMsg.includes('sell') ||
            lowerMsg.includes('buy') ||
            lowerMsg.includes('purchase')
        ) {
            const keywords = ['laptop', 'phone', 'tv', 'tablet', 'fridge'];
            const keyword = keywords.find(k => lowerMsg.includes(k));

            if (keyword) {
                const available = await Product.find({ name: new RegExp(keyword, 'i'), stock: { $gt: 0 } });

                if (available.length === 0) {
                    return res.json({ reply: `We currently have no ${keyword}s in stock. Please check back later.` });
                }

                return res.json({ reply: `Yes, we do have ${keyword}s in stock. You can visit our product page to see details.` });
            }

            return res.json({ reply: 'Yes, we do sell various products. Please mention what you’re looking for.' });
        }

        // 4. Match trained Q&A
        const trained = await Training.find({});
        const matched = trained.find(t => t.prompt && lowerMsg.includes(t.prompt.toLowerCase()));
        if (matched) {
            return res.json({ reply: matched.response });
        }


        if (!matched || matched.score < 0.7) {
            // Save unrecognized question for training
            await UntrainedQuestion.create({ question: userMessage });
            return res.json({ reply: "⚠️ I'm not sure how to respond to that. You can ask about products, orders, or talk to an agent on WhatsApp." });
        }

        // 6. Default fallback
        return res.json({ reply: `I'm not sure how to respond to that. You can ask me about available products or orders. orders, or talk to an agent on WhatsApp. using 0716085126 or 0757378874` });

    } catch (error) {
        console.error('Chat error:', error);
        return res.status(500).json({ reply: '⚠️ Something went wrong on our end.' });
    }
};
