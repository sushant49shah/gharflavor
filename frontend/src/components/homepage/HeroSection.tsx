import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
const HeroSection = () => {
    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative rounded-3xl bg-linear-to-br from-bg-surface to-bg-dark border border-border/50 p-8 md:p-20 overflow-hidden backdrop-blur-md shadow-2xl">
                {/* Hero background glow - Theme colors */}
                <div className="absolute -top-40 -right-40 h-112.5 w-112.5 rounded-full bg-accent/8 blur-[120px]" />
                <div className="absolute -bottom-40 -left-40 h-100 w-100 rounded-full bg-primary/8 blur-[100px]" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    {/* Left Hero Column */}
                    <div className="lg:col-span-7 space-y-8 text-left">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 backdrop-blur-sm">
                            <Sparkles className="h-3 w-3" />
                            Summer Collection Live
                        </span>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-tight">
                            Made at Home, <br />
                            <span className="text-gradient-indigo">Delivered with Love.</span>
                        </h1>
                        <p className="text-base sm:text-lg text-text-muted max-w-lg leading-relaxed opacity-90">
                            Discover authentic homemade meals crafted by passionate home chefs in your city. Fresh ingredients, real recipes, delivered straight to your door.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-linear-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 text-white font-semibold shadow-lg hover:scale-[1.04] transition-all duration-300 group"
                            >
                                Order Now
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-bg-surffrom-bg-surface hover:bg-[#3a3a3a] border border-border/60 text-bg-light font-semibold hover:border-accent/40 hover:scale-[1.04] transition-all duration-300"
                            >
                                Meet Our Chefs
                            </Link>
                        </div>
                    </div>

                    {/* Right Hero Column */}
                    <div className="lg:col-span-5 hidden lg:block">
                        <div className="relative p-6 rounded-2xl bg-linear-to-br from-bg-surface/80 to-bg-dark/80 border border-border/40 backdrop-blur-sm shadow-2xl overflow-hidden">
                            {/* Decorative gradient accent */}
                            <div className="absolute -top-20 -right-20 h-40 w-40 bg-accent/10 rounded-full blur-3xl opacity-50" />
                            
                            {/* Browser header decoration */}
                            <div className="flex items-center justify-between pb-4 border-b border-border/40 relative z-10">
                                <div className="flex gap-2">
                                    <span className="h-3 w-3 rounded-full bg-accent/80" />
                                    <span className="h-3 w-3 rounded-full bg-primary/80" />
                                    <span className="h-3 w-3 rounded-full bg-text-muted/80" />
                                </div>
                                <span className="text-xs text-text-muted font-mono tracking-wide">gharflavour.live</span>
                            </div>
                            <div className="space-y-4 pt-4 text-left relative z-10">
                                <div className="flex justify-between items-center bg-bg-dato-bg-dark/60 p-4 rounded-xl border border-border/30 hover:border-accent/30 transition-colors">
                                    <div>
                                        <p className="text-xs text-text-muted font-medium">Active Campaign</p>
                                        <p className="text-sm font-bold text-white">Summer Sale 2026</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-accent/15 text-accent border border-accent/30">-30% OFF</span>
                                </div>
                                <div className="bg-bg-dato-bg-dark/60 p-4 rounded-xl border border-border/30 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-text-muted">Live Stock Orders</span>
                                        <span className="text-accent flex items-center gap-1 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> Online</span>
                                    </div>
                                    <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                                        <div className="h-full w-4/5 bg-linear-to-r from-primary to-accent rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default HeroSection