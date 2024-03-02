import Html from "@kitajs/html";
import { Router } from "../router";
import { BaseHtml } from "../layouts/base";

import S3 from "@aws-sdk/client-s3";
import Lambda from "@aws-sdk/client-lambda";
import { separateFileExtension } from "../lib/utils";
export const S3Client = new S3.S3Client({ region: "eu-west-3" });
export const LambdaClient = new Lambda.LambdaClient({ region: "eu-west-3" });
const mybucket = "mybucketregli";

export const mainRouter = new Router()
  .get("/", () => {
    return (
      <BaseHtml>
        <form
          hx-post="/file"
          hx-replace-url="false"
          hx-swap="none"
          hx-encoding="multipart/form-data">
          <input type="file" name="file" />
          <button>Submit</button>
        </form>
      </BaseHtml>
    );
  })
  .post("/file", async (req) => {
    const formData = await req.formData();
    try {
      const fileBlob = formData.get("file") as Blob;
      const fileArrayBuffer = await fileBlob.arrayBuffer();
      const fileBuffer = Buffer.from(fileArrayBuffer);

      const fileName =
        crypto.randomUUID() + separateFileExtension(fileBlob.name)[1];

      //   const response = await client.send(
      //     new S3.PutObjectCommand({
      //       Bucket: mybucket,
      //       Key: fileName,
      //       Body: fileBuffer,
      //     }),
      //   );

      //   if (response.$metadata.httpStatusCode !== 200) throw Error;

      const payload = JSON.stringify({ file: fileName }); // remplacez par la charge utile à envoyer à votre fonction Lambda

      const response = await LambdaClient.send(
        new Lambda.InvokeCommand({
          FunctionName: "reglifunction",
          Payload: payload,
        }),
      );

      if (response.$metadata.httpStatusCode !== 200) throw Error;

      const result = JSON.parse(Buffer.from(response.Payload!).toString());
      if (
        !result ||
        result.statusCode === undefined ||
        result.statusCode !== 200 ||
        result.body === undefined ||
        typeof result !== "object"
      )
        throw Error;

      console.log(result.body);

      return "Nice";
    } catch (error) {
      return "Not nice";
    }
  });
