export default function Background() {
    return (
        <div className="cartoon-bg" aria-hidden="true">
            <svg
                viewBox="0 0 1920 1080"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#060618"/>
                        <stop offset="18%" stopColor="#0c0830"/>
                        <stop offset="38%" stopColor="#221048"/>
                        <stop offset="55%" stopColor="#4e1858"/>
                        <stop offset="70%" stopColor="#a03860"/>
                        <stop offset="82%" stopColor="#d86840"/>
                        <stop offset="92%" stopColor="#f0a050"/>
                        <stop offset="100%" stopColor="#f0b868"/>
                    </linearGradient>
                    <radialGradient id="sunGlow" cx="50%" cy="78%" r="25%">
                        <stop offset="0%" stopColor="#f0c860" stopOpacity="0.35"/>
                        <stop offset="50%" stopColor="#e08840" stopOpacity="0.1"/>
                        <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
                    </radialGradient>
                </defs>

                {/* Sky */}
                <rect width="1920" height="1080" fill="url(#sky)"/>
                <rect width="1920" height="1080" fill="url(#sunGlow)"/>

                {/* Sun */}
                <circle cx="960" cy="800" r="50" fill="#f0c060" opacity="0.5">
                    <animate attributeName="opacity" values="0.35;0.6;0.35" dur="6s" repeatCount="indefinite"/>
                </circle>
                <circle cx="960" cy="800" r="90" fill="#f0a040" opacity="0.12"/>
                <circle cx="960" cy="800" r="150" fill="#e08030" opacity="0.04"/>

                {/* Stars — static */}
                <circle cx="120" cy="48" r="1.5" fill="white" opacity="0.6"/>
                <circle cx="340" cy="105" r="1" fill="white" opacity="0.4"/>
                <circle cx="680" cy="125" r="1.2" fill="white" opacity="0.45"/>
                <circle cx="1050" cy="75" r="1" fill="white" opacity="0.4"/>
                <circle cx="1380" cy="115" r="1.5" fill="white" opacity="0.5"/>
                <circle cx="1700" cy="95" r="1" fill="white" opacity="0.35"/>
                <circle cx="230" cy="175" r="1" fill="white" opacity="0.3"/>
                <circle cx="500" cy="225" r="1.2" fill="white" opacity="0.25"/>
                <circle cx="780" cy="195" r="1" fill="white" opacity="0.25"/>
                <circle cx="1150" cy="165" r="1.2" fill="white" opacity="0.25"/>
                <circle cx="1480" cy="205" r="1" fill="white" opacity="0.2"/>
                <circle cx="1780" cy="175" r="1.5" fill="white" opacity="0.3"/>
                <circle cx="420" cy="300" r="1" fill="white" opacity="0.15"/>
                <circle cx="920" cy="265" r="1" fill="white" opacity="0.15"/>
                <circle cx="1320" cy="280" r="1" fill="white" opacity="0.15"/>

                {/* Stars — twinkling */}
                <circle cx="500" cy="38" r="2" fill="white">
                    <animate attributeName="opacity" values="0.25;0.9;0.25" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="1200" cy="50" r="2" fill="white">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="4s" begin="1s" repeatCount="indefinite"/>
                </circle>
                <circle cx="850" cy="60" r="1.8" fill="#aaccff">
                    <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3.5s" begin="0.5s"
                             repeatCount="indefinite"/>
                </circle>
                <circle cx="1600" cy="42" r="2.2" fill="white">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="4.5s" begin="2s"
                             repeatCount="indefinite"/>
                </circle>
                <circle cx="150" cy="125" r="1.5" fill="#bbddff">
                    <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.8s" begin="1.5s"
                             repeatCount="indefinite"/>
                </circle>
                <circle cx="1850" cy="55" r="1.8" fill="#ffddaa">
                    <animate attributeName="opacity" values="0.25;0.8;0.25" dur="3.2s" begin="0.8s"
                             repeatCount="indefinite"/>
                </circle>

                {/* Clouds — slowly drifting */}
                <g opacity="0.07">
                    <animateTransform attributeName="transform" type="translate" values="0,0;50,0;0,0" dur="80s"
                                      repeatCount="indefinite"/>
                    <ellipse cx="320" cy="195" rx="140" ry="30" fill="white"/>
                    <ellipse cx="385" cy="183" rx="90" ry="24" fill="white"/>
                    <ellipse cx="258" cy="188" rx="80" ry="22" fill="white"/>
                </g>
                <g opacity="0.05">
                    <animateTransform attributeName="transform" type="translate" values="0,0;-35,0;0,0" dur="100s"
                                      repeatCount="indefinite"/>
                    <ellipse cx="1400" cy="255" rx="160" ry="32" fill="white"/>
                    <ellipse cx="1475" cy="243" rx="100" ry="26" fill="white"/>
                    <ellipse cx="1330" cy="247" rx="85" ry="22" fill="white"/>
                </g>
                <g opacity="0.04">
                    <animateTransform attributeName="transform" type="translate" values="0,0;30,0;0,0" dur="90s"
                                      repeatCount="indefinite"/>
                    <ellipse cx="850" cy="325" rx="120" ry="26" fill="#ffeecc"/>
                    <ellipse cx="915" cy="315" rx="80" ry="22" fill="#ffeecc"/>
                </g>

                {/* Mountain — back */}
                <path
                    d="M-50,1080 L-50,640 Q150,550 350,620 Q550,490 750,570 Q950,450 1150,540 Q1350,420 1550,510 Q1750,430 1970,500 L1970,1080Z"
                    fill="#150822"
                    opacity="0.55"
                />
                {/* Mountain — mid */}
                <path
                    d="M-50,1080 L-50,720 Q100,650 250,700 Q450,590 650,680 Q850,580 1050,650 Q1250,560 1450,640 Q1650,560 1850,620 L1970,600 L1970,1080Z"
                    fill="#0d0418"
                    opacity="0.7"
                />
                {/* Mountain — front */}
                <path
                    d="M-50,1080 L-50,790 Q100,730 250,770 Q450,680 650,750 Q850,670 1050,730 Q1250,660 1450,720 Q1650,650 1850,700 L1970,690 L1970,1080Z"
                    fill="#080210"
                    opacity="0.88"
                />

                {/* Ground */}
                <rect y="850" width="1920" height="230" fill="#04010a" opacity="0.95"/>

                {/* Fireflies — floating upward */}
                <circle cx="320" cy="740" r="2.5" fill="#f0c060">
                    <animate attributeName="cy" values="740;480;250" dur="14s" repeatCount="indefinite"/>
                    <animate attributeName="cx" values="320;340;310" dur="14s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.7;0" dur="14s" repeatCount="indefinite"/>
                </circle>
                <circle cx="780" cy="800" r="2" fill="#f0d080">
                    <animate attributeName="cy" values="800;560;330" dur="17s" begin="3s" repeatCount="indefinite"/>
                    <animate attributeName="cx" values="780;800;770" dur="17s" begin="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.6;0" dur="17s" begin="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="1200" cy="770" r="2.5" fill="#f0b060">
                    <animate attributeName="cy" values="770;510;270" dur="19s" begin="6s" repeatCount="indefinite"/>
                    <animate attributeName="cx" values="1200;1180;1210" dur="19s" begin="6s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.5;0" dur="19s" begin="6s" repeatCount="indefinite"/>
                </circle>
                <circle cx="550" cy="820" r="1.8" fill="#f0e0a0">
                    <animate attributeName="cy" values="820;590;380" dur="16s" begin="9s" repeatCount="indefinite"/>
                    <animate attributeName="cx" values="550;570;540" dur="16s" begin="9s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.6;0" dur="16s" begin="9s" repeatCount="indefinite"/>
                </circle>
                <circle cx="1500" cy="760" r="2" fill="#f0c070">
                    <animate attributeName="cy" values="760;520;300" dur="18s" begin="2s" repeatCount="indefinite"/>
                    <animate attributeName="cx" values="1500;1520;1490" dur="18s" begin="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.55;0" dur="18s" begin="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="1000" cy="850" r="2.2" fill="#f0d090">
                    <animate attributeName="cy" values="850;610;370" dur="20s" begin="11s" repeatCount="indefinite"/>
                    <animate attributeName="cx" values="1000;1020;990" dur="20s" begin="11s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0;0.5;0" dur="20s" begin="11s" repeatCount="indefinite"/>
                </circle>
            </svg>
        </div>
    );
}
