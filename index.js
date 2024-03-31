const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const https = require("https");
const { Upload } = require("@aws-sdk/lib-storage");

// URL du fichier CSV à télécharger
const csvUrl =
  "https://rfzinhsehiklkjcqyqak.supabase.co/storage/v1/object/public/bucket/regression_sample.csv?t=2024-03-31T21%3A51%3A15.732Z";

// Nom du bucket S3 de destination
const bucketName = "mybucketregli";

// Clé (nom de fichier) pour le fichier dans S3
const key = crypto.randomUUID() + ".csv";

// Configurez les informations d'identification AWS
const s3Client = new S3Client({
  region: "eu-west-3",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Créez un flux de données à partir de l'URL
const fileStream = https.get(csvUrl, (response) => {
  // Chargez le flux de données directement sur S3

  const uploader = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: key,
      Body: response,
    },
  });

  try {
    uploader.done().then((data) => {
      console.log("File uploaded successfully:", data.Location);
    });
  } catch (err) {
    console.error("Error uploading file:", err);
  }
});
