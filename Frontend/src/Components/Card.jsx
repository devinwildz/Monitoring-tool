const Card = ({ icon, title, description }) => {
    return (
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-green-500 transition">
            <div className="flex justify-center items-center mb-4">
                <div className="bg-green-900/20 p-3 rounded-full">
                    {icon}
                </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    );
};

export default Card;
