const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predictClassification(model, image) {
    
    try 
    {
        /**
         * Convert gambar menjadi tensor. 
         * .node untuk menangani proses inferensi data.
            .decodeJpeg() untuk melakukan decode terhadap input data baru.
            .resizeNearestNeighbor untuk melakukan resize gambar menggunakan algoritma Nearest Neighbor.
            .expandDims() untuk menambah dimensi gambar.
            .toFloat() untuk mengubah seluruh data yang diproses menjadi float.
        */
        const tensor = tf.node
        .decodeJpeg(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;
        
        let suggestion;

        if (confidenceScore > 50) {
            label = 'Cancer';
            suggestion = "Segera konsultasi dengan dokter terdekat untuk pemeriksaan lebih lanjut."
        } 

        if (confidenceScore <= 50) {
            label = 'Non-cancer';
            suggestion = "Tetap jaga kesehatan kulit dan hindari paparan sinar UV secara berlebihan."
        }

        return { confidenceScore, label, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan dalam melakukan prediksi`);
    }
   
}

module.exports = predictClassification;