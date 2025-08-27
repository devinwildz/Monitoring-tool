import { Mail, Circle, Twitter, Github, Linkedin, Send } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-[#0c1624] to-[#0b1a2e] text-gray-300 px-6 md:px-16 py-10">
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-800 rounded-2xl p-8">
                    {/* Top section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Logo & Description */}
                        <div className="animate-fade-in">
                            <div className="flex items-center gap-2 mb-3">
                                <Circle className="text-green-500 fill-green-500 w-3 h-3" />
                                <h2 className="font-bold text-lg">MonitorPro</h2>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Professional website monitoring and uptime tracking service. Keep your
                                websites running smoothly with real-time alerts and detailed analytics.
                            </p>
                            <div className="flex items-center gap-2 mt-4">
                                <Mail className="text-green-500 w-5 h-5" />
                                <span className="text-gray-300 text-sm">
                                    support@monitorpro.com
                                </span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                            <h3 className="font-semibold mb-3">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="hover:text-green-500 cursor-pointer transition-colors">Home</li>
                                <li className="hover:text-green-500 cursor-pointer transition-colors">Features</li>
                                <li className="hover:text-green-500 cursor-pointer transition-colors">Pricing</li>
                                <li className="hover:text-green-500 cursor-pointer transition-colors">Contact</li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                            <h3 className="font-semibold mb-3">Support</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="hover:text-green-500 cursor-pointer transition-colors">Help Center</li>
                                <li className="hover:text-green-500 cursor-pointer transition-colors">Documentation</li>
                                <li className="hover:text-green-500 cursor-pointer transition-colors">System Status</li>
                                <li className="hover:text-green-500 cursor-pointer transition-colors">Privacy Policy</li>
                            </ul>
                        </div>

                        {/* Newsletter Subscription */}
                        <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                            <h3 className="font-semibold mb-3">Stay Updated</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Subscribe for updates and monitoring tips.
                            </p>
                            <form className="flex items-center gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-slate-700 text-gray-300 text-sm rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                            <div className="flex gap-4 mt-4 justify-start">
                                <a href="https://twitter.com" className="hover:text-green-500 transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="https://github.com" className="hover:text-green-500 transition-colors">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="https://linkedin.com" className="hover:text-green-500 transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-700 my-6" />

                    {/* Bottom section */}
                    <div className="flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm">
                        <p className="animate-fade-in">
                            © {new Date().getFullYear()} MonitorPro. All rights reserved.
                        </p>
                        <div className="flex gap-4 mt-4 sm:mt-0 animate-slide-up" style={{ animationDelay: "400ms" }}>
                            <span className="hover:text-green-500 cursor-pointer transition-colors">Terms of Service</span>
                            <span className="hover:text-green-500 cursor-pointer transition-colors">Cookie Policy</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}