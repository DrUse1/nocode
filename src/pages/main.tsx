import Html from "@kitajs/html";
import { Router } from "$/router";
import { BaseHtml } from "$/layouts/base";

import S3 from "@aws-sdk/client-s3";
import Lambda from "@aws-sdk/client-lambda";
import { separateFileExtension } from "$/lib/utils";
import {
  Badge,
  Button,
  Input,
  InputError,
  InputGroup,
  Label,
  Separator,
} from "$/components/Basic";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "$/components/Card";
import { ChevronDownIcon } from "$/icons";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "$/components/Table";
export const S3Client = new S3.S3Client({ region: "eu-west-3" });
export const LambdaClient = new Lambda.LambdaClient({ region: "eu-west-3" });
const mybucket = "mybucketregli";

export const mainRouter = new Router()
  .get("/", () => {
    return (
      <BaseHtml class="m-4">
        <div
          hx-ext="sse"
          sse-connect="/stream"
          sse-swap="message"
          hx-target="#stream"
          hx-swap="beforeend"
          id="triggerer"></div>
        <div id="stream"></div>
      </BaseHtml>
    );
  })
  .get("/stream", () => {
    const stream = new ReadableStream({
      start(controller) {
        let i = 1;
        const timer = setInterval(() => {
          if (i > 10) {
            clearInterval(timer);
            controller.enqueue(
              `data: <div id="triggerer" hx-swap-oob="true"></div>\n\n`,
            );
            controller.close();
            return;
          }
          controller.enqueue(`data: <span>Content ${i}</span>\n\n`);
          i++;
        }, 200);
      },
    });

    return new Response(stream, {
      headers: {
        "content-type": "text/event-stream",
      },
    });
  })
  .post("/file", async (req) => {
    const formData = await req.formData();
    try {
      const fileBlob = formData.get("file") as Blob;
      const fileArrayBuffer = await fileBlob.arrayBuffer();
      const fileBuffer = Buffer.from(fileArrayBuffer);

      const fileName =
        crypto.randomUUID() + separateFileExtension(fileBlob.name)[1];

      const response = await S3Client.send(
        new S3.PutObjectCommand({
          Bucket: mybucket,
          Key: fileName,
          Body: fileBuffer,
        }),
      );

      if (response.$metadata.httpStatusCode !== 200) throw Error;

      console.log(response);

      const payload = JSON.stringify({ file: fileName }); // remplacez par la charge utile à envoyer à votre fonction Lambda

      const responseLambda = await LambdaClient.send(
        new Lambda.InvokeCommand({
          FunctionName: "reglifunction",
          Payload: payload,
        }),
      );

      if (responseLambda.$metadata.httpStatusCode !== 200) throw Error;

      const result = JSON.parse(
        Buffer.from(responseLambda.Payload!).toString(),
      );
      if (
        !result ||
        result.statusCode === undefined ||
        result.statusCode !== 200 ||
        result.body === undefined ||
        typeof result !== "object"
      )
        throw Error;

      console.log(result);

      return "Nice";
    } catch (error) {
      return "Not nice";
    }
  });
