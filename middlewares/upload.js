import multer from 'multer';

// Armazena o arquivo em memória (não salva no disco)
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
