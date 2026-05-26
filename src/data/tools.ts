export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'PDF' | 'Image' | 'Dev' | 'Data' | 'Security' | 'CSS';
  icon: string;
  popular?: boolean;
  tags: string[];
  placeholderInput?: string;
  placeholderOutput?: string;
}

export const CATEGORIES = ['PDF', 'Image', 'Dev', 'Data', 'Security', 'CSS'] as const;

export const TOOLS: Tool[] = [
  // --- PDF TOOLS (9) ---
  {
    id: 'pdf-to-word',
    name: 'PDF to Word Converter',
    description: 'Convert PDF documents to editable Microsoft Word files with layout retention.',
    category: 'PDF',
    icon: 'FileText',
    popular: true,
    tags: ['pdf', 'word', 'doc', 'docx', 'convert', 'office'],
    placeholderInput: 'Upload a .pdf document',
    placeholderOutput: 'Download .docx document'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF Converter',
    description: 'Convert Microsoft Word DOCX files to clean, standard PDF documents.',
    category: 'PDF',
    icon: 'FileCode',
    tags: ['pdf', 'word', 'doc', 'docx', 'convert', 'office'],
    placeholderInput: 'Upload a .docx document',
    placeholderOutput: 'Download .pdf document'
  },
  {
    id: 'pdf-merge',
    name: 'PDF Merge Utility',
    description: 'Combine multiple PDF files into a single, unified document in custom order.',
    category: 'PDF',
    icon: 'Combine',
    popular: true,
    tags: ['pdf', 'merge', 'combine', 'join', 'concat'],
    placeholderInput: 'Upload two or more .pdf files',
    placeholderOutput: 'Download merged .pdf document'
  },
  {
    id: 'pdf-split',
    name: 'PDF Splitter',
    description: 'Extract specific pages or split a PDF into separate files instantly.',
    category: 'PDF',
    icon: 'Scissors',
    tags: ['pdf', 'split', 'extract', 'pages', 'divide'],
    placeholderInput: 'Upload a .pdf document and specify page range (e.g. 1-3, 5)',
    placeholderOutput: 'Download split PDF pages (.zip)'
  },
  {
    id: 'pdf-compress',
    name: 'Compress PDF',
    description: 'Reduce the file size of PDF documents while preserving maximum visual quality.',
    category: 'PDF',
    icon: 'FileDown',
    popular: true,
    tags: ['pdf', 'compress', 'shrink', 'optimize', 'size'],
    placeholderInput: 'Upload a .pdf document',
    placeholderOutput: 'Download optimized .pdf (Saved 45% size)'
  },
  {
    id: 'pdf-protect',
    name: 'Protect PDF (Encrypt)',
    description: 'Add secure passwords and restrict permissions on sensitive PDF files.',
    category: 'PDF',
    icon: 'ShieldAlert',
    tags: ['pdf', 'password', 'encrypt', 'protect', 'secure', 'lock'],
    placeholderInput: 'Upload a .pdf document and type a secure password',
    placeholderOutput: 'Download encrypted .pdf'
  },
  {
    id: 'pdf-unlock',
    name: 'Unlock PDF (Decrypt)',
    description: 'Remove password protection, restrictions, and write locks from PDFs.',
    category: 'PDF',
    icon: 'ShieldOff',
    tags: ['pdf', 'password', 'decrypt', 'unlock', 'remove', 'open'],
    placeholderInput: 'Upload encrypted .pdf and provide password',
    placeholderOutput: 'Download unlocked .pdf'
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image Converter',
    description: 'Convert PDF pages into high-resolution PNG, JPG, or WebP images.',
    category: 'PDF',
    icon: 'Image',
    tags: ['pdf', 'image', 'png', 'jpg', 'convert', 'extract'],
    placeholderInput: 'Upload a .pdf document',
    placeholderOutput: 'Download pages as PNG images (.zip)'
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF Converter',
    description: 'Convert and compile JPG, PNG, and BMP images into a clean PDF document.',
    category: 'PDF',
    icon: 'FileUp',
    tags: ['pdf', 'image', 'png', 'jpg', 'jpeg', 'convert', 'compile'],
    placeholderInput: 'Upload one or more images (.png, .jpg)',
    placeholderOutput: 'Download compiled .pdf document'
  },

  // --- IMAGE TOOLS (10) ---
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Reduce image sizes up to 80% without losing visible quality for WebP, PNG, and JPG.',
    category: 'Image',
    icon: 'Shrink',
    popular: true,
    tags: ['image', 'compress', 'optimize', 'png', 'jpg', 'webp', 'size'],
    placeholderInput: 'Upload an image (.png, .jpg, .webp)',
    placeholderOutput: 'Saved 68% size. Download optimized image'
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize image dimensions by pixels or percentage with aspect ratio constraints.',
    category: 'Image',
    icon: 'Maximize',
    tags: ['image', 'resize', 'dimensions', 'width', 'height', 'scale'],
    placeholderInput: 'Upload image and enter width/height (e.g. 1920x1080)',
    placeholderOutput: 'Download resized image'
  },
  {
    id: 'image-converter',
    name: 'Image Format Converter',
    description: 'Convert between PNG, JPG, WebP, AVIF, BMP, and TIFF formats instantly.',
    category: 'Image',
    icon: 'RefreshCw',
    tags: ['image', 'format', 'convert', 'png', 'jpg', 'webp', 'avif'],
    placeholderInput: 'Upload an image and select target format (e.g., WebP)',
    placeholderOutput: 'Download converted image'
  },
  {
    id: 'bg-remover',
    name: 'Background Remover',
    description: 'Premium AI background removal tool to isolate subjects in images.',
    category: 'Image',
    icon: 'Sparkles',
    popular: true,
    tags: ['image', 'background', 'remove', 'transparent', 'ai', 'mask'],
    placeholderInput: 'Upload image with clear foreground subject',
    placeholderOutput: 'Download transparent foreground PNG'
  },
  {
    id: 'color-picker',
    name: 'Color Picker & Palette',
    description: 'Pick colors, generate harmonic palettes, and extract dominant colors from images.',
    category: 'Image',
    icon: 'Palette',
    tags: ['image', 'color', 'picker', 'palette', 'rgb', 'hex', 'harmony'],
    placeholderInput: 'Upload image or paste HEX code (e.g., #6366f1)',
    placeholderOutput: 'HEX: #6366F1 | RGB: (99, 102, 241) | HSL: (239, 84%, 67%)'
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop images to standard aspect ratios (1:1, 16:9, 4:3) or custom bounding boxes.',
    category: 'Image',
    icon: 'Crop',
    tags: ['image', 'crop', 'trim', 'aspect', 'ratio', 'cut'],
    placeholderInput: 'Upload image and choose crop area',
    placeholderOutput: 'Download cropped image'
  },
  {
    id: 'svg-to-png',
    name: 'SVG to PNG Converter',
    description: 'Render vector SVG files into raster PNG images with custom scaling.',
    category: 'Image',
    icon: 'FileImage',
    tags: ['svg', 'png', 'vector', 'raster', 'convert', 'render'],
    placeholderInput: 'Upload vector .svg file',
    placeholderOutput: 'Download rasterized .png image'
  },
  {
    id: 'png-to-svg',
    name: 'PNG to SVG Vectorizer',
    description: 'Trace raster images (PNG, JPG) and convert them into clean vector SVG paths.',
    category: 'Image',
    icon: 'MoveRight',
    tags: ['png', 'svg', 'vectorize', 'trace', 'convert', 'vector'],
    placeholderInput: 'Upload solid icon or logo (.png, .jpg)',
    placeholderOutput: 'Download traced .svg vector'
  },
  {
    id: 'meme-generator',
    name: 'Meme Generator',
    description: 'Create hilarious memes with custom top/bottom text and templates.',
    category: 'Image',
    icon: 'Smile',
    tags: ['image', 'meme', 'generator', 'caption', 'funny', 'template'],
    placeholderInput: 'Upload image template and enter captions',
    placeholderOutput: 'Download meme graphic'
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate customizable, high-fidelity QR codes for URLs, text, or WiFi credentials.',
    category: 'Image',
    icon: 'QrCode',
    tags: ['qr', 'code', 'generate', 'link', 'wifi', 'svg', 'barcode'],
    placeholderInput: 'https://toolwool.com',
    placeholderOutput: 'Rendered vector QR Code SVG'
  },

  // --- DEV TOOLS (10) ---
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Beautify, minify, validate, and debug JSON objects with inline error highlighting.',
    category: 'Dev',
    icon: 'Braces',
    popular: true,
    tags: ['json', 'formatter', 'beautify', 'validate', 'syntax', 'linter'],
    placeholderInput: '{\n"name":"toolwool",\n"specs":{"tools":57,"categories":6}\n}',
    placeholderOutput: '{\n  "name": "toolwool",\n  "specs": {\n    "tools": 57,\n    "categories": 6\n  }\n}'
  },
  {
    id: 'base64-codec',
    name: 'Base64 Encoder / Decoder',
    description: 'Convert text or binary assets safely to and from Base64 ASCII strings.',
    category: 'Dev',
    icon: 'Binary',
    tags: ['base64', 'encode', 'decode', 'ascii', 'binary', 'string'],
    placeholderInput: 'Welcome to ToolWool!',
    placeholderOutput: 'V2VsY29tZSB0byBUb29sV29vbCE='
  },
  {
    id: 'url-codec',
    name: 'URL Encoder / Decoder',
    description: 'Encode special characters in URLs to make them safe, or decode human-readable parameters.',
    category: 'Dev',
    icon: 'Link2',
    tags: ['url', 'uri', 'encode', 'decode', 'parameter', 'query'],
    placeholderInput: 'https://toolwool.com/search?q=pdf & css tools',
    placeholderOutput: 'https%3A%2F%2Ftoolwool.com%2Fsearch%3Fq%3Dpdf%20%26%20css%20tools'
  },
  {
    id: 'code-minifier',
    name: 'HTML/CSS/JS Minifier',
    description: 'Compress and strip comments, white spaces, and line breaks from front-end source code.',
    category: 'Dev',
    icon: 'Minimize2',
    tags: ['html', 'css', 'js', 'minify', 'compress', 'optimize'],
    placeholderInput: 'body {\n  background-color: #000000;\n  color: #ffffff;\n}',
    placeholderOutput: 'body{background-color:#000;color:#fff}'
  },
  {
    id: 'code-formatter',
    name: 'HTML/CSS/JS Formatter',
    description: 'Format unreadable minified front-end source files into standard indent structures.',
    category: 'Dev',
    icon: 'Code2',
    tags: ['html', 'css', 'js', 'formatter', 'beautify', 'prettify'],
    placeholderInput: 'div{display:flex;align-items:center;}',
    placeholderOutput: 'div {\n  display: flex;\n  align-items: center;\n}'
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter & Validator',
    description: 'Beautify, inspect, and check XML data against syntax structures.',
    category: 'Dev',
    icon: 'FileCode2',
    tags: ['xml', 'formatter', 'beautify', 'validate', 'rss', 'sitemap'],
    placeholderInput: '<toolwool><tools count="57"><tool>PDF</tool></tools></toolwool>',
    placeholderOutput: '<toolwool>\n  <tools count="57">\n    <tool>PDF</tool>\n  </tools>\n</toolwool>'
  },
  {
    id: 'yaml-to-json',
    name: 'YAML to JSON Converter',
    description: 'Convert human-readable YAML configurations to standard structured JSON strings.',
    category: 'Dev',
    icon: 'CornerDownRight',
    tags: ['yaml', 'json', 'convert', 'config', 'serialize'],
    placeholderInput: 'platform: ToolWool\ncategories:\n  - PDF\n  - CSS',
    placeholderOutput: '{\n  "platform": "ToolWool",\n  "categories": [\n    "PDF",\n    "CSS"\n  ]\n}'
  },
  {
    id: 'json-to-yaml',
    name: 'JSON to YAML Converter',
    description: 'Serialize standard structured JSON objects into clean, indented YAML configs.',
    category: 'Dev',
    icon: 'CornerRightDown',
    tags: ['json', 'yaml', 'convert', 'serialize', 'config'],
    placeholderInput: '{\n  "platform": "ToolWool",\n  "categories": ["PDF", "CSS"]\n}',
    placeholderOutput: 'platform: ToolWool\ncategories:\n- PDF\n- CSS'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester & Explainer',
    description: 'Test regular expressions against target strings with matches, captures, and step explanations.',
    category: 'Dev',
    icon: 'Parentheses',
    tags: ['regex', 'regular expression', 'test', 'matcher', 'string', 'replace'],
    placeholderInput: 'Pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g\nTest: Contact us at info@toolwool.com or support@toolwool.net',
    placeholderOutput: 'MATCH 1: info@toolwool.com (Index: 14)\nMATCH 2: support@toolwool.net (Index: 35)'
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Live Editor',
    description: 'Write Markdown syntax and preview fully formatted rich HTML side-by-side.',
    category: 'Dev',
    icon: 'Bookmark',
    popular: true,
    tags: ['markdown', 'editor', 'preview', 'html', 'md', 'wysiwyg'],
    placeholderInput: '# ToolWool Platform\n\n- **Category**: Dev\n- **Feature**: Markdown',
    placeholderOutput: '<h1>ToolWool Platform</h1>\n<ul>\n<li><strong>Category</strong>: Dev</li>\n<li><strong>Feature</strong>: Markdown</li>\n</ul>'
  },

  // --- DATA TOOLS (9) ---
  {
    id: 'csv-to-json',
    name: 'CSV to JSON Converter',
    description: 'Transform tabular CSV spreadsheets into structured JSON arrays instantly.',
    category: 'Data',
    icon: 'Table',
    popular: true,
    tags: ['csv', 'json', 'convert', 'table', 'data', 'excel'],
    placeholderInput: 'id,name,category\n1,PDF Merger,PDF\n2,Color Picker,Image',
    placeholderOutput: '[\n  {\n    "id": "1",\n    "name": "PDF Merger",\n    "category": "PDF"\n  },\n  {\n    "id": "2",\n    "name": "Color Picker",\n    "category": "Image"\n  }\n]'
  },
  {
    id: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Flatten arrays of JSON objects into tabular CSV structures ready for Excel.',
    category: 'Data',
    icon: 'Sheet',
    tags: ['json', 'csv', 'convert', 'table', 'data', 'excel'],
    placeholderInput: '[\n  {"id":1, "name":"PDF"}, \n  {"id":2, "name":"Image"}\n]',
    placeholderOutput: 'id,name\n1,PDF\n2,Image'
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter & Beautifier',
    description: 'Format unaligned SQL queries with standard uppercase statements and beautiful indentation.',
    category: 'Data',
    icon: 'Database',
    tags: ['sql', 'query', 'formatter', 'beautify', 'mysql', 'postgres', 'database'],
    placeholderInput: 'select id,name from tools where category=\'dev\' order by id desc;',
    placeholderOutput: 'SELECT\n  id,\n  name\nFROM\n  tools\nWHERE\n  category = \'dev\'\nORDER BY\n  id DESC;'
  },
  {
    id: 'xml-to-json',
    name: 'XML to JSON Converter',
    description: 'Translate nested XML element trees into clean JSON objects.',
    category: 'Data',
    icon: 'ChevronsRight',
    tags: ['xml', 'json', 'convert', 'nested', 'data'],
    placeholderInput: '<platform><name>ToolWool</name><specs><tools>57</tools></specs></platform>',
    placeholderOutput: '{\n  "platform": {\n    "name": "ToolWool",\n    "specs": {\n      "tools": "57"\n    }\n  }\n}'
  },
  {
    id: 'json-to-xml',
    name: 'JSON to XML Converter',
    description: 'Convert structured JSON objects into nested XML tag formats.',
    category: 'Data',
    icon: 'ChevronsLeft',
    tags: ['json', 'xml', 'convert', 'nested', 'data'],
    placeholderInput: '{\n  "platform": {\n    "name": "ToolWool"\n  }\n}',
    placeholderOutput: '<platform>\n  <name>ToolWool</name>\n</platform>'
  },
  {
    id: 'uuid-generator',
    name: 'UUID / GUID Generator',
    description: 'Generate cryptographically secure v4 UUIDs bulk-wise instantly.',
    category: 'Data',
    icon: 'Fingerprint',
    popular: true,
    tags: ['uuid', 'guid', 'generate', 'id', 'random', 'key', 'bulk'],
    placeholderInput: 'Quantity: 3',
    placeholderOutput: 'd8c72fa0-1b77-4ba5-8b39-86c241517f8a\nfa42d76a-5431-419b-a320-7b290cb7ea12\n7cb9ef38-5182-4fcf-b6a9-83c389bf44ad'
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate mock paragraphs, sentences, words, or lists for layout placeholders.',
    category: 'Data',
    icon: 'FileDigit',
    tags: ['lorem', 'ipsum', 'text', 'placeholder', 'generate', 'mock'],
    placeholderInput: 'Type: Paragraphs | Count: 2',
    placeholderOutput: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.'
  },
  {
    id: 'text-diff',
    name: 'Text Diff Checker',
    description: 'Compare two text passages side-by-side or inline to find additions, deletions, and differences.',
    category: 'Data',
    icon: 'Split',
    tags: ['diff', 'compare', 'text', 'match', 'changes', 'patch'],
    placeholderInput: 'Text A: ToolWool platform has 57 tools.\nText B: ToolWool dashboard has 57 premium tools.',
    placeholderOutput: 'ToolWool [-platform-] {+dashboard+} has 57 {+premium+} tools.'
  },
  {
    id: 'case-converter',
    name: 'Smart Case Converter',
    description: 'Convert strings to UPPERCASE, lowercase, Title Case, camelCase, snake_case, or kebab-case.',
    category: 'Data',
    icon: 'CaseSensitive',
    tags: ['case', 'convert', 'upper', 'lower', 'title', 'camel', 'snake', 'string'],
    placeholderInput: 'toolwool: dashboard layout for modern tools',
    placeholderOutput: 'UPPER: TOOLWOOL: DASHBOARD LAYOUT FOR MODERN TOOLS\nTitle: Toolwool: Dashboard Layout For Modern Tools\nCamel: toolwoolDashboardLayoutForModernTools\nSnake: toolwool_dashboard_layout_for_modern_tools'
  },

  // --- SECURITY TOOLS (9) ---
  {
    id: 'password-generator',
    name: 'Strong Password Generator',
    description: 'Generate high-entropy secure passwords with length controls, symbols, and number toggles.',
    category: 'Security',
    icon: 'Lock',
    popular: true,
    tags: ['password', 'generate', 'secure', 'strength', 'entropy', 'crypto'],
    placeholderInput: 'Length: 16 | Numbers: Yes | Symbols: Yes',
    placeholderOutput: 'K#9v$mP2!xQ8&wzT'
  },
  {
    id: 'hash-generator',
    name: 'Cryptographic Hash Generator',
    description: 'Compute MD5, SHA-1, SHA-256, and SHA-512 hashes for custom strings locally.',
    category: 'Security',
    icon: 'KeyRound',
    tags: ['hash', 'md5', 'sha256', 'sha512', 'checksum', 'crypto'],
    placeholderInput: 'toolwool',
    placeholderOutput: 'MD5: c4ef130f1469e38d72120e2efc1bbd11\nSHA-256: d85a81cf25462cf1b8dfd4b7c14a2bb3c8ff0d6447e171b3e83b879cf1d4285b'
  },
  {
    id: 'jwt-debugger',
    name: 'JWT Token Debugger',
    description: 'Decode payload claims, header segments, and verify cryptographic signatures of JWT tokens.',
    category: 'Security',
    icon: 'FileCheck',
    popular: true,
    tags: ['jwt', 'token', 'decode', 'auth', 'signature', 'payload'],
    placeholderInput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    placeholderOutput: 'HEADER: {\n  "alg": "HS256",\n  "typ": "JWT"\n}\n\nPAYLOAD: {\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}'
  },
  {
    id: 'symmetric-encryption',
    name: 'AES Encryption/Decryption',
    description: 'Encrypt data using highly secure AES-256 cipher blocks with a private password key.',
    category: 'Security',
    icon: 'Key',
    tags: ['aes', 'encryption', 'decryption', 'secret', 'password', 'cipher'],
    placeholderInput: 'Data: Top Secret ToolWool Code\nPassword: my-secure-pass',
    placeholderOutput: 'Ciphertext: U2FsdGVkX19P/mQJ3W6DqR3fB3p1hHjS3u6f238o0='
  },
  {
    id: 'password-strength',
    name: 'Password Strength Tester',
    description: 'Analyze password security, structural entropy, common patterns, and estimation times to crack.',
    category: 'Security',
    icon: 'ShieldQuestion',
    tags: ['password', 'strength', 'linter', 'entropy', 'breach', 'security'],
    placeholderInput: 'admin123',
    placeholderOutput: 'STRENGTH: CRITICAL (Weak)\nEntropy: 21 bits\nCrack Time Estimate: Instant (Common dictionary word)'
  },
  {
    id: 'html-entities',
    name: 'HTML Entity Encoder / Decoder',
    description: 'Encode characters into safe XML/HTML entities, or translate raw codes back into symbols.',
    category: 'Security',
    icon: 'Code',
    tags: ['html', 'entities', 'encode', 'decode', 'character', 'escape'],
    placeholderInput: '<div>Hello & Welcome</div>',
    placeholderOutput: '&lt;div&gt;Hello &amp; Welcome&lt;/div&gt;'
  },
  {
    id: 'ip-lookup',
    name: 'IP Address Analyzer (Mock)',
    description: 'Inspect public client IP, reverse DNS headers, subnets, and geo-ISP metrics.',
    category: 'Security',
    icon: 'Globe',
    tags: ['ip', 'dns', 'geo', 'isp', 'lookup', 'client', 'network'],
    placeholderInput: '8.8.8.8',
    placeholderOutput: 'IP: 8.8.8.8 | ISP: Google LLC | Geo: Mountain View, California, US'
  },
  {
    id: 'port-scanner',
    name: 'Port Status Checker (Mock)',
    description: 'Scan standard local/remote server ports (80, 443, 22, 3000) for response statuses.',
    category: 'Security',
    icon: 'Radio',
    tags: ['port', 'scanner', 'host', 'network', 'status', 'ping'],
    placeholderInput: 'localhost',
    placeholderOutput: 'Port 80: OPEN\nPort 443: OPEN\nPort 22: CLOSED\nPort 3000: OPEN (Next.js Dev Server)'
  },
  {
    id: 'pem-decoder',
    name: 'PEM Certificate Decoder',
    description: 'Parse SSL/TLS certificates (.crt, .pem, .key) to read issuer metadata, algorithms, and key bits.',
    category: 'Security',
    icon: 'LockKeyhole',
    tags: ['pem', 'crt', 'certificate', 'ssl', 'tls', 'parser', 'key'],
    placeholderInput: '-----BEGIN CERTIFICATE-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Y...\n-----END CERTIFICATE-----',
    placeholderOutput: 'Common Name: toolwool.com\nIssuer: Let\'s Encrypt Authority X3\nKey Type: RSA (2048 bits)\nValid Until: 2026-12-31'
  },

  // --- CSS TOOLS (10) ---
  {
    id: 'css-gradient',
    name: 'CSS Gradient Generator',
    description: 'Visual gradient design utility to draft linear, radial, or conic Tailwind and CSS styles.',
    category: 'CSS',
    icon: 'Sun',
    popular: true,
    tags: ['css', 'gradient', 'linear', 'radial', 'background', 'color', 'design'],
    placeholderInput: 'Type: Linear | Colors: #6366f1 to #ec4899 | Angle: 45deg',
    placeholderOutput: 'background: linear-gradient(45deg, #6366f1, #ec4899);\nTailwind: bg-gradient-to-tr from-indigo-500 to-pink-500'
  },
  {
    id: 'css-shadow',
    name: 'CSS Box Shadow Generator',
    description: 'Model smooth multi-layered soft drop shadows, inset filters, and spread parameters.',
    category: 'CSS',
    icon: 'Box',
    tags: ['css', 'shadow', 'box shadow', 'drop shadow', 'inset', 'blur'],
    placeholderInput: 'X: 0px | Y: 10px | Blur: 25px | Spread: -5px | Color: rgba(0,0,0,0.1)',
    placeholderOutput: 'box-shadow: 0px 10px 25px -5px rgba(0, 0, 0, 0.1);\nTailwind: shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.1)]'
  },
  {
    id: 'css-glassmorphism',
    name: 'CSS Glassmorphism Generator',
    description: 'Draft elegant frosted-glass background cards with background blur, outline, and translucency.',
    category: 'CSS',
    icon: 'Layers',
    popular: true,
    tags: ['css', 'glassmorphism', 'glass', 'blur', 'backdrop', 'translucent', 'frosted'],
    placeholderInput: 'Opacity: 15% | Blur: 10px | Border: rgba(255,255,255,0.1)',
    placeholderOutput: 'background: rgba(255, 255, 255, 0.15);\nbackdrop-filter: blur(10px);\nborder: 1px solid rgba(255, 255, 255, 0.1);\nTailwind: bg-white/15 backdrop-blur-md border border-white/10'
  },
  {
    id: 'css-grid',
    name: 'CSS Grid Layout Generator',
    description: 'Construct multi-column grid layouts with column sizes, gap structures, and track alignments.',
    category: 'CSS',
    icon: 'LayoutGrid',
    tags: ['css', 'grid', 'columns', 'rows', 'gap', 'layout'],
    placeholderInput: 'Cols: 3 (1fr each) | Rows: 2 | Gap: 16px',
    placeholderOutput: 'display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngrid-template-rows: repeat(2, 1fr);\ngrid-gap: 16px;\nTailwind: grid grid-cols-3 grid-rows-2 gap-4'
  },
  {
    id: 'css-flexbox',
    name: 'CSS Flexbox Playground',
    description: 'Configure layout parameters like direction, wrap, alignment, and gap offsets interactively.',
    category: 'CSS',
    icon: 'Columns3',
    tags: ['css', 'flexbox', 'flex', 'align', 'justify', 'direction', 'gap'],
    placeholderInput: 'Direction: Row | Justify: Space-Between | Align: Center | Gap: 8px',
    placeholderOutput: 'display: flex;\nflex-direction: row;\njustify-content: space-between;\nalign-items: center;\ngap: 8px;\nTailwind: flex flex-row justify-between items-center gap-2'
  },
  {
    id: 'css-border-radius',
    name: 'CSS Border Radius Generator',
    description: 'Draft custom border-radius properties with separate controls for all corners.',
    category: 'CSS',
    icon: 'Grid',
    tags: ['css', 'border', 'radius', 'corners', 'round'],
    placeholderInput: 'Top-Left: 12px | Top-Right: 24px | Bottom-Right: 12px | Bottom-Left: 6px',
    placeholderOutput: 'border-radius: 12px 24px 12px 6px;\nTailwind: rounded-[12px_24px_12px_6px]'
  },
  {
    id: 'css-text-shadow',
    name: 'CSS Text Shadow Generator',
    description: 'Model glowing neon, offset, or drop shadows for typography designs.',
    category: 'CSS',
    icon: 'Type',
    tags: ['css', 'shadow', 'text shadow', 'font', 'glow', 'blur'],
    placeholderInput: 'X: 2px | Y: 2px | Blur: 4px | Color: #6366f1',
    placeholderOutput: 'text-shadow: 2px 2px 4px #6366f1;'
  },
  {
    id: 'css-keyframes',
    name: 'CSS Keyframe Generator',
    description: 'Generate CSS animation keyframes and standard easing attributes easily.',
    category: 'CSS',
    icon: 'Tv',
    tags: ['css', 'animation', 'keyframes', 'animate', 'pulse', 'rotate'],
    placeholderInput: 'Name: pulse-glow\n0%: scale(1), opacity(0.5)\n100%: scale(1.05), opacity(1)',
    placeholderOutput: '@keyframes pulse-glow {\n  0% { transform: scale(1); opacity: 0.5; }\n  100% { transform: scale(1.05); opacity: 1; }\n}'
  },
  {
    id: 'css-transition',
    name: 'CSS Transition Tester',
    description: 'Experiment and model standard CSS cubic-bezier transition curves and timing intervals.',
    category: 'CSS',
    icon: 'SlidersHorizontal',
    tags: ['css', 'transition', 'cubic-bezier', 'timing', 'duration', 'delay'],
    placeholderInput: 'Property: all | Duration: 300ms | Easing: cubic-bezier(0.4, 0, 0.2, 1)',
    placeholderOutput: 'transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);\nTailwind: transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]'
  },
  {
    id: 'tailwind-palette',
    name: 'Tailwind Class Generator',
    description: 'Quickly generate custom margins, paddings, display settings, and grid classes dynamically.',
    category: 'CSS',
    icon: 'Atom',
    popular: true,
    tags: ['tailwind', 'css', 'class', 'padding', 'margin', 'flex', 'text', 'utility'],
    placeholderInput: 'Padding: 16px | Margin: 8px | Align: Center | Background: Indigo-500',
    placeholderOutput: 'CSS: padding: 16px; margin: 8px; text-align: center; background-color: #6366f1;\nTailwind: p-4 m-2 text-center bg-indigo-500'
  }
];
