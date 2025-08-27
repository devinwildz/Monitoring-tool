
import { CheckCircle, XCircle } from "lucide-react";

const Pricing = () => {
    const plans = [
        {
            name: "Basic",
            price: "$9",
            period: "/month",
            description: "Perfect for small websites and startups.",
            features: [
                { text: "Monitor up to 3 websites", available: true },
                { text: "1-minute monitoring interval", available: true },
                { text: "Email alerts", available: true },
                { text: "Basic analytics", available: true },
                { text: "SMS alerts", available: false },
                { text: "API access", available: false },
            ],
            cta: "Start Free Trial",
        },
        {
            name: "Pro",
            price: "$29",
            period: "/month",
            description: "Ideal for growing businesses with multiple websites.",
            features: [
                { text: "Monitor up to 10 websites", available: true },
                { text: "30-second monitoring interval", available: true },
                { text: "Email & SMS alerts", available: true },
                { text: "Advanced analytics", available: true },
                { text: "API access", available: true },
                { text: "Priority support", available: true },
            ],
            cta: "Start Free Trial",
            highlighted: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "Tailored for large-scale operations with custom needs.",
            features: [
                { text: "Unlimited websites", available: true },
                { text: "15-second monitoring interval", available: true },
                { text: "Email & SMS alerts", available: true },
                { text: "Premium analytics", available: true },
                { text: "Full API access", available: true },
                { text: "Dedicated support", available: true },
            ],
            cta: "Contact Sales",
        },
    ];

    const faqs = [
        {
            question: "Is there a free trial available?",
            answer: "Yes, all plans come with a 14-day free trial, no credit card required.",
        },
        {
            question: "Can I change plans later?",
            answer: "Absolutely, you can upgrade or downgrade your plan at any time from your account dashboard.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service.",
        },
    ];

    return (
        <div className="text-white bg-gray-900">
            

            {/* Hero Section */}
            <section className="py-20 text-center px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                    Choose the Perfect Plan
                </h1>
                <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg animate-slide-up">
                    Affordable pricing for businesses of all sizes. Start monitoring your websites today with our flexible plans.
                </p>
            </section>

            {/* Pricing Table */}
            <section className="py-16 px-4 bg-gradient-to-b from-gray-900 via-green-900/20 to-gray-900">
                <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`border bg-gray-800 border-gray-700 ${plan.highlighted ? "border-green-500 shadow-lg shadow-green-500/20" : "hover:border-green-500"
                                } transition rounded-xl p-6 flex flex-col animate-slide-up`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <h2 className="text-2xl font-semibold text-white mb-2">{plan.name}</h2>
                            <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-green-400">{plan.price}</span>
                                {plan.period && <span className="text-gray-400 text-sm ml-1">{plan.period}</span>}
                            </div>
                            <ul className="space-y-3 mb-6 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        {feature.available ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-gray-500" />
                                        )}
                                        <span className={feature.available ? "text-gray-300" : "text-gray-500"}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`${plan.highlighted
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-gray-700 hover:bg-gray-600"
                                    } text-white font-semibold py-3 px-6 rounded-lg transition w-full`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 animate-fade-in">
                    Frequently Asked Questions
                </h2>
                <div className="max-w-4xl mx-auto space-y-6">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 rounded-xl p-6 text-left animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                            <p className="text-gray-300 text-sm">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Pricing;