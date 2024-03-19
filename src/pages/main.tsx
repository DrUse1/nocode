import Html from "@kitajs/html";
import { Router } from "$/router";
import { BaseHtml } from "$/layouts/base";

import S3 from "@aws-sdk/client-s3";
import Lambda from "@aws-sdk/client-lambda";
import { separateFileExtension } from "$/lib/utils";
import CloudWatch, {
  DescribeLogStreamsCommand,
  FilterLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";

const busboy = require("busboy");
import { IncomingForm } from "formidable";

import streamifier from "streamifier";
import csvParser from "csv-parser";
const fs = require("fs");

export const S3Client = new S3.S3Client({ region: "eu-west-3" });
export const LambdaClient = new Lambda.LambdaClient({ region: "eu-west-3" });
export const CloudwatchClient = new CloudWatch.CloudWatchLogsClient({
  region: "eu-west-3",
});
const mybucket = "mybucketregli";

export const mainRouter = new Router()
  .get("/", () => {
    return (
      <BaseHtml class="m-4">
        <form
          hx-post="/file"
          hx-encoding="multipart/form-data"
          hx-swap="none"
          hx-replace-url="false">
          <input type="file" name="file" id="file" />
          <button>Submit</button>
        </form>
      </BaseHtml>
    );
  })
  .post("/file", async (req) => {
    const reader = req.body!.getReader();

    let done = true;

    const uploadStream = S3Client.send(
      new S3.PutObjectCommand({
        Bucket: mybucket,
        Key: "testFile.json",
        // Body: req.body,
      }),
    );

    let i = 0;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        const decoder = new TextDecoder();
        const str = decoder.decode(value);
      }
    }
    // console.log(result);
    console.log("done");
    // Fermer le stream
    reader.cancel("Stream closed");

    // for await (const chunk of reader) {
    //   const decoder = new TextDecoder();
    //   const str = decoder.decode(chunk);
    //   console.log(str);
    // }
    // console.log("done");

    // const file = formData.get("file") as Blob;
    // const csvText = await file.text();
    // const firstLines = csvText.split("\n").slice(0, 5);
    // const firstLinesCols = firstLines.map((e) => e.split(",").slice(0, 5));

    // console.log(firstLinesCols);

    return "";
    // try {
    //   const fileBlob = formData.get("file") as Blob;
    //   const fileArrayBuffer = await fileBlob.arrayBuffer();
    //   const fileBuffer = Buffer.from(fileArrayBuffer);

    //   const fileName =
    //     crypto.randomUUID() + separateFileExtension(fileBlob.name)[1];

    //   // const response = await S3Client.send(
    //   //   new S3.PutObjectCommand({
    //   //     Bucket: mybucket,
    //   //     Key: fileName,
    //   //     Body: fileBuffer,
    //   //   }),
    //   // );

    //   // if (response.$metadata.httpStatusCode !== 200) throw Error;

    //   // console.log(response);

    //   const payload = JSON.stringify({ file: fileName }); // remplacez par la charge utile à envoyer à votre fonction Lambda

    //   const responseLambda = await LambdaClient.send(
    //     new Lambda.InvokeCommand({
    //       FunctionName: "reglifunction",
    //       Payload: payload,
    //       ClientContext: Buffer.from(
    //         JSON.stringify({ userID: "123455" }),
    //       ).toString("base64"),
    //     }),
    //   );

    //   if (responseLambda.$metadata.httpStatusCode !== 200) throw Error;

    //   //TODO parse the result
    //   const result = JSON.parse(
    //     Buffer.from(responseLambda.Payload!).toString(),
    //   );

    //   // console.log(responseLambda);

    //   const requestId = responseLambda.$metadata.requestId;
    //   console.log(requestId);

    //   const logGroupName = "/aws/lambda/reglifunction";
    //   // const requestId = "abbb2387-3834-41b1-947a-0cd24af8f391";

    //   await new Promise((resolve) => setTimeout(resolve, 10000));

    //   const responseCloudWatch = await CloudwatchClient.send(
    //     new FilterLogEventsCommand({
    //       logGroupName,
    //       filterPattern: `"REPORT RequestId: ${requestId}"`,
    //       startTime: Date.now() - 3600000, // 1 hour ago
    //       endTime: Date.now(),
    //     }),
    //   );

    //   console.log(responseCloudWatch);

    //   return "Nice";
    // } catch (error) {
    //   console.log(error);
    //   return "Not nice";
    // }
  });
