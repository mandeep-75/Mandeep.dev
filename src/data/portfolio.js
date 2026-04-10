import BlackLoopImage from "../assets/blackloop_homepage.png";
import yt_automation from "../assets/yt_automation.png"
import coc_bot from "../assets/coc_bot.png"
import subtitle from "../assets/subtitle.png"
import nexus_go from "../assets/nexus_go_combined.png"
export const projects = [
    {
        id: 1,
        title: "YouTube Automation",
        description: "AI-powered pipeline that transforms raw videos into narrated YouTube Shorts with auto-upload.",
        tags: ["Python", "Ollama", "Automation", "AI"],
        image: yt_automation,
        link: "#",
        github: "https://github.com/mandeep-75/youtube_automation",
        privateCode: false,
        socialLinks: {
            youtube: "https://www.youtube.com/@bangb_iteeg"
        },
        contact: "#contact"
    },
    {
        id: 2,
        title: "BlackLoop",
        description: "Movie browsing platform with direct torrent magnet links.",
        tags: ["React", "API", "Torrent"],
        image: BlackLoopImage,
        link: "https://movies-react.vercel.app/",
        github: "https://github.com/mandeep-75/Blackloop"
    },
    {
        id: 3,
        title: "CoC Bot",
        description: "Terminal bot automating Clash of Clans attacks with ADB and image recognition.",
        tags: ["Python", "ADB", "Automation"],
        image: coc_bot,
        video: "/Mandeep.dev/coc-bot.mp4",
        link: "#",
        github: "https://github.com/mandeep-75/coc_bot"
    },
    {
        id: 4,
        title: "AutoSub Burn",
        description: "Video subtitling tool using Whisper for transcription and karaoke effects.",
        tags: ["Python", "Whisper", "Video"],
        image: subtitle,
        link: "https://colab.research.google.com/github/mandeep-75/autosub-burn/blob/python-whisper/colab/subtitles.ipynb",
        github: "https://github.com/mandeep-75/autosub-burn"
    },
    {
        id: 5,
        title: "Nexus Go",
        description: "React Native app with custom WebView, tab navigation.",
        tags: ["React Native", "Expo", "Mobile"],
        image: nexus_go,
        link: "#",
        github: "https://github.com/mandeep-75/WebViewApp"
    },
];
