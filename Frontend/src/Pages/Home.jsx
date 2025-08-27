
import Card from "../Components/Card";
import { Monitor, Bell, Activity, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    const features = [
        {
            icon: <Monitor className="w-8 h-8 text-green-500" />,
            title: "Real-time Monitoring",
            description:
                "Monitor your websites every minute with instant notifications when issues are detected.",
        },
        {
            icon: <Bell className="w-8 h-8 text-green-500" />,
            title: "Instant Alerts",
            description:
                "Get notified instantly via email or SMS when your website goes down or becomes slow.",
        },
        {
            icon: <Activity className="w-8 h-8 text-green-500" />,
            title: "Performance Tracking",
            description:
                "Track website speed, uptime, and performance trends with detailed analytics.",
        },
        {
            icon: <Shield className="w-8 h-8 text-green-500" />,
            title: "Secure & Reliable",
            description:
                "We use secure infrastructure to ensure your monitoring data is always safe and private.",
        },
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "CTO, TechTrend Innovations",
            quote: "MonitorPro has been a game-changer for our team. The real-time alerts saved us from major downtime!",
            rating: 5,
        },
        {
            name: "Mike Chen",
            role: "Founder, E-commerce Hub",
            quote: "The analytics dashboard is fantastic. We optimized our site speed thanks to their insights.",
            rating: 4,
        },
    ];

    return (
        <div className="text-white">

            {/* Hero Section - Full Screen */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                    Monitor Your Websites{" "}
                    <span className="text-green-500">24/7</span>
                </h1>
                <p className="text-gray-300 max-w-2xl mb-10 text-sm sm:text-base md:text-lg animate-slide-up">
                    Get instant alerts when your websites go down. Track uptime, performance,
                    and user experience with our professional monitoring service.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-200">
                    <Link to="/register" className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition text-sm sm:text-base">
                        Get Started Free
                    </Link>
                    <Link to="/login" className="bg-gray-800 cursor-pointer hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg border border-gray-600 transition text-sm sm:text-base">
                        Sign In
                    </Link>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-20 text-center px-4 bg-gradient-to-b from-gray-900 via-green-900/20 to-gray-900">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                    Why Choose MonitorPro?
                </h1>
                <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg animate-slide-up">
                    Ensure your websites are always online with our advanced monitoring tools and instant notifications.
                </p>
                {/* Cards Grid */}
                <div className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols- früh4 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            className="animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        />
                    ))}
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-16 text-center bg-gradient-to-b from-gray-900 to-gray-800">
                <h2 className="text-3xl sm:text-4xl font-bold mb-8 animate-fade-in">
                    What Our Users Say
                </h2>
                <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 rounded-xl p-6 text-left shadow-lg animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-300 text-sm mb-4">"{testimonial.quote}"</p>
                            <p className="text-white font-semibold">{testimonial.name}</p>
                            <p className="text-gray-400 text-sm">{testimonial.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Teaser Section */}
            <section className="py-16 text-center bg-gradient-to-b from-gray-900 via-green-900/20 to-gray-900">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 animate-fade-in">
                    Affordable Plans for Every Need
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base md:text-lg animate-slide-up">
                    From startups to enterprises, we have a plan that fits your budget and requirements.
                </p>
                <Link to="/pricing">
                    <button className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition text-sm sm:text-base animate-slide-up delay-200">
                        Explore Pricing
                    </button>
                </Link>
            </section>

            {/* Stats & CTA Section */}
            <section className="bg-gradient-to-b from-[#0c1624] to-[#0b1a2e] py-16">
                {/* Stats Cards */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { value: "99.9%", label: "Uptime Guarantee" },
                        { value: "<30s", label: "Alert Response Time" },
                        { value: "50+", label: "Global Locations" },
                        { value: "10K+", label: "Websites Monitored" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="border bg-gray-900 border-gray-700 hover:border-green-500 transition rounded-xl p-6 text-center shadow-lg animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <h2 className="text-4xl font-bold text-green-400">{stat.value}</h2>
                            <p className="text-gray-400 text-md mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto px-6 mt-16">
                    <div className="bg-[#111c2f] rounded-xl p-10 text-center shadow-lg animate-fade-in">
                        <h2 className="text-4xl font-bold text-white">
                            Ready to Start Monitoring?
                        </h2>
                        <p className="text-gray-400 text-xl mt-2">
                            Join thousands of businesses that trust MonitorPro to keep their
                            websites online.
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                            
                            
                            <Link to="/register" className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition text-sm sm:text-base">
                                Start Free Trial →
                            </Link>
                            <Link to="/login" className="bg-gray-800 cursor-pointer hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg border border-gray-600 transition text-sm sm:text-base">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;