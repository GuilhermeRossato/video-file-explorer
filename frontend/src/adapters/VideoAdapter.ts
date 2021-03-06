const endpoint = `http://[::1]:8081/`;

export async function getVideoMetadata(filePath: string) {
    const response = await fetch(endpoint + "api/get-video-metadata/", {
        method: "POST",
        body: filePath
    });
    if (!response.ok) {
        const result = await response.json();
        if (result && result.error) {
            throw new Error("Server returned error message: " + result.error);
        }
        throw new Error("Server returned status code " + response.status + ": " + response.statusText);
    }
    const result = await response.json();
    if (result && result.error) {
        throw new Error("Server returned error message: " + result.error);
    }
    if (!result.duration || isNaN(result.duration)) {
        throw new Error("Server returned invalid file metadata for duration property");
    }
    if (!result.width || isNaN(result.width) || !result.height || isNaN(result.height)) {
        throw new Error("Server returned invalid file metadata for width and height property");
    }
    return result as {duration: number, width: number, height: number}
}

export function getVideoTypeFromFilename(fileName: string) {
    const index = fileName.lastIndexOf(".");
    if (index === -1) {
        return undefined;
    }

    return ({
        "3dostr": "3DO STR",
        "4xm": "4X Technologies",
        "aa": "Audible AA format files",
        "aac": "raw ADTS AAC (Advanced Audio Coding)",
        "ac3": "raw AC-3",
        "acm": "Interplay ACM",
        "act": "ACT Voice file format",
        "adf": "Artworx Data Format",
        "adp": "ADP",
        "ads": "Sony PS2 ADS",
        "adx": "CRI ADX",
        "aea": "MD STUDIO audio",
        "afc": "AFC",
        "aiff": "Audio IFF",
        "aix": "CRI AIX",
        "alaw": "PCM A-law",
        "alias_pix": "Alias/Wavefront PIX image",
        "alp": "LEGO Racers ALP",
        "amr": "3GPP AMR",
        "amrnb": "raw AMR-NB",
        "amrwb": "raw AMR-WB",
        "anm": "Deluxe Paint Animation",
        "apc": "CRYO APC",
        "ape": "Monkey's Audio",
        "apm": "Ubisoft Rayman 2 APM",
        "apng": "Animated Portable Network Graphics",
        "aptx": "raw aptX",
        "aptx_hd": "raw aptX HD",
        "aqtitle": "AQTitle subtitles",
        "argo_asf": "Argonaut Games ASF",
        "asf": "ASF (Advanced / Active Streaming Format)",
        "asf_o": "ASF (Advanced / Active Streaming Format)",
        "ass": "SSA (SubStation Alpha) subtitle",
        "ast": "AST (Audio Stream)",
        "au": "Sun AU",
        "av1": "AV1 Annex B",
        "avi": "AVI (Audio Video Interleaved)",
        "avisynth": "AviSynth script",
        "avr": "AVR (Audio Visual Research)",
        "avs": "Argonaut Games Creature Shock",
        "avs2": "raw AVS2-P2/IEEE1857.4",
        "bethsoftvid": "Bethesda Softworks VID",
        "bfi": "Brute Force & Ignorance",
        "bfstm": "BFSTM (Binary Cafe Stream)",
        "bin": "Binary text",
        "bink": "Bink",
        "bit": "G.729 BIT file format",
        "bmp_pipe": "piped bmp sequence",
        "bmv": "Discworld II BMV",
        "boa": "Black Ops Audio",
        "brender_pix": "BRender PIX image",
        "brstm": "BRSTM (Binary Revolution Stream)",
        "c93": "Interplay C93",
        "caf": "Apple CAF (Core Audio Format)",
        "cavsvideo": "raw Chinese AVS (Audio Video Standard)",
        "cdg": "CD Graphics",
        "cdxl": "Commodore CDXL video",
        "cine": "Phantom Cine",
        "codec2": "codec2 .c2 demuxer",
        "codec2raw": "raw codec2 demuxer",
        "concat": "Virtual concatenation script",
        "dash": "Dynamic Adaptive Streaming over HTTP",
        "data": "raw data",
        "daud": "D-Cinema audio",
        "dcstr": "Sega DC STR",
        "dds_pipe": "piped dds sequence",
        "derf": "Xilam DERF",
        "dfa": "Chronomaster DFA",
        "dhav": "Video DAV",
        "dirac": "raw Dirac",
        "dnxhd": "raw DNxHD (SMPTE VC-3)",
        "dpx_pipe": "piped dpx sequence",
        "dsf": "DSD Stream File (DSF)",
        "dshow": "DirectShow capture",
        "dsicin": "Delphine Software International CIN",
        "dss": "Digital Speech Standard (DSS)",
        "dts": "raw DTS",
        "dtshd": "raw DTS-HD",
        "dv": "DV (Digital Video)",
        "dvbsub": "raw dvbsub",
        "dvbtxt": "dvbtxt",
        "dxa": "DXA",
        "ea": "Electronic Arts Multimedia",
        "ea_cdata": "Electronic Arts cdata",
        "eac3": "raw E-AC-3",
        "epaf": "Ensoniq Paris Audio File",
        "exr_pipe": "piped exr sequence",
        "f32be": "PCM 32-bit floating-point big-endian",
        "f32le": "PCM 32-bit floating-point little-endian",
        "f64be": "PCM 64-bit floating-point big-endian",
        "f64le": "PCM 64-bit floating-point little-endian",
        "ffmetadata": "FFmpeg metadata in text",
        "film_cpk": "Sega FILM / CPK",
        "filmstrip": "Adobe Filmstrip",
        "fits": "Flexible Image Transport System",
        "flac": "raw FLAC",
        "flic": "FLI/FLC/FLX animation",
        "flv": "FLV (Flash Video)",
        "frm": "Megalux Frame",
        "fsb": "FMOD Sample Bank",
        "fwse": "Capcom's MT Framework sound",
        "g722": "raw G.722",
        "g723_1": "G.723.1",
        "g726": "raw big-endian G.726 (left aligned)",
        "g726le": "raw little-endian G.726 (right aligned)",
        "g729": "G.729 raw format demuxer",
        "gdigrab": "GDI API Windows frame grabber",
        "gdv": "Gremlin Digital Video",
        "genh": "GENeric Header",
        "gif": "CompuServe Graphics Interchange Format (GIF)",
        "gif_pipe": "piped gif sequence",
        "gsm": "raw GSM",
        "gxf": "GXF (General eXchange Format)",
        "h261": "raw H.261",
        "h263": "raw H.263",
        "h264": "raw H.264 video",
        "hca": "CRI HCA",
        "hcom": "Macintosh HCOM",
        "hevc": "raw HEVC video",
        "hls": "Apple HTTP Live Streaming",
        "hnm": "Cryo HNM v4",
        "idcin": "id Cinematic",
        "idf": "iCE Draw File",
        "iff": "IFF (Interchange File Format)",
        "ifv": "IFV CCTV DVR",
        "ilbc": "iLBC storage",
        "image2": "image2 sequence",
        "image2pipe": "piped image2 sequence",
        "ingenient": "raw Ingenient MJPEG",
        "ipmovie": "Interplay MVE",
        "ircam": "Berkeley/IRCAM/CARL Sound Format",
        "iss": "Funcom ISS",
        "iv8": "IndigoVision 8000 video",
        "ivf": "On2 IVF",
        "ivr": "IVR (Internet Video Recording)",
        "j2k_pipe": "piped j2k sequence",
        "jacosub": "JACOsub subtitle format",
        "jpeg_pipe": "piped jpeg sequence",
        "jpegls_pipe": "piped jpegls sequence",
        "jv": "Bitmap Brothers JV",
        "kux": "KUX (YouKu)",
        "kvag": "Simon & Schuster Interactive VAG",
        "lavfi": "Libavfilter virtual input device",
        "libopenmpt": "Tracker formats (libopenmpt)",
        "live_flv": "live RTMP FLV (Flash Video)",
        "lmlm4": "raw lmlm4",
        "loas": "LOAS AudioSyncStream",
        "lrc": "LRC lyrics",
        "lvf": "LVF",
        "lxf": "VR native stream (LXF)",
        "m4v": "raw MPEG-4 video",
        "matroska": "webm   Matroska / WebM",
        "mgsts": "Metal Gear Solid: The Twin Snakes",
        "microdvd": "MicroDVD subtitle format",
        "mjpeg": "raw MJPEG video",
        "mlp": "raw MLP",
        "mlv": "Magic Lantern Video (MLV)",
        "mm": "American Laser Games MM",
        "mmf": "Yamaha SMAF",
        "mov": "QuickTime / MOV",
        "mp4": "QuickTime / MOV",
        "m4a": "QuickTime / MOV",
        "3gp": "QuickTime / MOV",
        "3g2": "QuickTime / MOV",
        "mj2": "QuickTime / MOV",
        "mp3": "MP2/3 (MPEG audio layer 2/3)",
        "mpc": "Musepack",
        "mpc8": "Musepack SV8",
        "mpeg": "MPEG-PS (MPEG-2 Program Stream)",
        "mpegts": "MPEG-TS (MPEG-2 Transport Stream)",
        "mpegtsraw": "raw MPEG-TS (MPEG-2 Transport Stream)",
        "mpegvideo": "raw MPEG video",
        "mpjpeg": "MIME multipart JPEG",
        "mpl2": "MPL2 subtitles",
        "mpsub": "MPlayer subtitles",
        "msf": "Sony PS3 MSF",
        "msnwctcp": "MSN TCP Webcam stream",
        "mtaf": "Konami PS2 MTAF",
        "mtv": "MTV",
        "mulaw": "PCM mu-law",
        "musx": "Eurocom MUSX",
        "mv": "Silicon Graphics Movie",
        "mvi": "Motion Pixels MVI",
        "mxf": "MXF (Material eXchange Format)",
        "mxg": "MxPEG clip",
        "nc": "NC camera feed",
        "nistsphere": "NIST SPeech HEader REsources",
        "nsp": "Computerized Speech Lab NSP",
        "nsv": "Nullsoft Streaming Video",
        "nut": "NUT",
        "nuv": "NuppelVideo",
        "ogg": "Ogg",
        "oma": "Sony OpenMG audio",
        "paf": "Amazing Studio Packed Animation File",
        "pam_pipe": "piped pam sequence",
        "pbm_pipe": "piped pbm sequence",
        "pcx_pipe": "piped pcx sequence",
        "pgm_pipe": "piped pgm sequence",
        "pgmyuv_pipe": "piped pgmyuv sequence",
        "pictor_pipe": "piped pictor sequence",
        "pjs": "PJS (Phoenix Japanimation Society) subtitles",
        "pmp": "Playstation Portable PMP",
        "png_pipe": "piped png sequence",
        "ppm_pipe": "piped ppm sequence",
        "psd_pipe": "piped psd sequence",
        "psxstr": "Sony Playstation STR",
        "pva": "TechnoTrend PVA",
        "pvf": "PVF (Portable Voice Format)",
        "qcp": "QCP",
        "qdraw_pipe": "piped qdraw sequence",
        "r3d": "REDCODE R3D",
        "rawvideo": "raw video",
        "realtext": "RealText subtitle format",
        "redspark": "RedSpark",
        "rl2": "RL2",
        "rm": "RealMedia",
        "roq": "id RoQ",
        "rpl": "RPL / ARMovie",
        "rsd": "GameCube RSD",
        "rso": "Lego Mindstorms RSO",
        "rtp": "RTP input",
        "rtsp": "RTSP input",
        "s16be": "PCM signed 16-bit big-endian",
        "s16le": "PCM signed 16-bit little-endian",
        "s24be": "PCM signed 24-bit big-endian",
        "s24le": "PCM signed 24-bit little-endian",
        "s32be": "PCM signed 32-bit big-endian",
        "s32le": "PCM signed 32-bit little-endian",
        "s337m": "SMPTE 337M",
        "s8": "PCM signed 8-bit",
        "sami": "SAMI subtitle format",
        "sap": "SAP input",
        "sbc": "raw SBC (low-complexity subband codec)",
        "sbg": "SBaGen binaural beats script",
        "scc": "Scenarist Closed Captions",
        "sdp": "SDP",
        "sdr2": "SDR2",
        "sds": "MIDI Sample Dump Standard",
        "sdx": "Sample Dump eXchange",
        "ser": "SER (Simple uncompressed video format for astronomical capturing)",
        "sgi_pipe": "piped sgi sequence",
        "shn": "raw Shorten",
        "siff": "Beam Software SIFF",
        "sln": "Asterisk raw pcm",
        "smjpeg": "Loki SDL MJPEG",
        "smk": "Smacker",
        "smush": "LucasArts Smush",
        "sol": "Sierra SOL",
        "sox": "SoX native",
        "spdif": "IEC 61937 (compressed data in S/PDIF)",
        "srt": "SubRip subtitle",
        "stl": "Spruce subtitle format",
        "subviewer": "SubViewer subtitle format",
        "subviewer1": "SubViewer v1 subtitle format",
        "sunrast_pipe": "piped sunrast sequence",
        "sup": "raw HDMV Presentation Graphic Stream subtitles",
        "svag": "Konami PS2 SVAG",
        "svg_pipe": "piped svg sequence",
        "swf": "SWF (ShockWave Flash)",
        "tak": "raw TAK",
        "tedcaptions": "TED Talks captions",
        "thp": "THP",
        "tiertexseq": "Tiertex Limited SEQ",
        "tiff_pipe": "piped tiff sequence",
        "tmv": "8088flex TMV",
        "truehd": "raw TrueHD",
        "tta": "TTA (True Audio)",
        "tty": "Tele-typewriter",
        "txd": "Renderware TeXture Dictionary",
        "ty": "TiVo TY Stream",
        "u16be": "PCM unsigned 16-bit big-endian",
        "u16le": "PCM unsigned 16-bit little-endian",
        "u24be": "PCM unsigned 24-bit big-endian",
        "u24le": "PCM unsigned 24-bit little-endian",
        "u32be": "PCM unsigned 32-bit big-endian",
        "u32le": "PCM unsigned 32-bit little-endian",
        "u8": "PCM unsigned 8-bit",
        "v210": "Uncompressed 4:2:2 10-bit",
        "v210x": "Uncompressed 4:2:2 10-bit",
        "vag": "Sony PS2 VAG",
        "vc1": "raw VC-1",
        "vc1test": "VC-1 test bitstream",
        "vfwcap": "VfW video capture",
        "vidc": "PCM Archimedes VIDC",
        "vividas": "Vividas VIV",
        "vivo": "Vivo",
        "vmd": "Sierra VMD",
        "vobsub": "VobSub subtitle format",
        "voc": "Creative Voice",
        "vpk": "Sony PS2 VPK",
        "vplayer": "VPlayer subtitles",
        "vqf": "Nippon Telegraph and Telephone Corporation (NTT) TwinVQ",
        "w64": "Sony Wave64",
        "wav": "WAV / WAVE (Waveform Audio)",
        "wc3movie": "Wing Commander III movie",
        "webm_dash_manifest": "WebM DASH Manifest",
        "webp_pipe": "piped webp sequence",
        "webvtt": "WebVTT subtitle",
        "wsaud": "Westwood Studios audio",
        "wsd": "Wideband Single-bit Data (WSD)",
        "wsvqa": "Westwood Studios VQA",
        "wtv": "Windows Television (WTV)",
        "wv": "WavPack",
        "wve": "Psion 3 audio",
        "xa": "Maxis XA",
        "xbin": "eXtended BINary text (XBIN)",
        "xmv": "Microsoft XMV",
        "xpm_pipe": "piped xpm sequence",
        "xvag": "Sony PS3 XVAG",
        "xwd_pipe": "piped xwd sequence",
        "xwma": "Microsoft xWMA",
        "yop": "Psygnosis YOP",
        "yuv4mpegpipe": "YUV4MPEG pipe"
    })[fileName.substr(index + 1)];
}