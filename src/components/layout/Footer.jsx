export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-1">
                    <h3 className="text-white text-2xl font-bold mb-4">GlowCare.</h3>
                    <p className="text-sm leading-relaxed">
                        Revolutionizing skin health through data-driven routines and local climate intelligence.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">The System</h4>
                    <ul className="space-y-2 text-sm">
                        <li>Ingredient Filtering</li>
                        <li>Timeline View</li>
                        <li>Sensitivity Mapping</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li>Emergency Dermatologist</li>
                        <li>Ayurvedic Specialists</li>
                        <li>Reaction Reporting</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Newsletter</h4>
                    <div className="flex">
                        <input type="email" placeholder="Email" className="bg-slate-800 border-none rounded-l-lg p-2 w-full focus:ring-1 ring-skin-primary" />
                        <button className="bg-skin-primary text-white px-4 rounded-r-lg">Join</button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
                © 2026 Skincare Routing Project. All Rights Reserved.
            </div>
        </footer>
    );
}