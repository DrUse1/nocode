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

import { db, getUserFromSession } from "$/lib/db";
import { datasets, users } from "$/lib/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "$/components/Basic";

export const S3Client = new S3.S3Client({ region: "eu-west-3" });
export const LambdaClient = new Lambda.LambdaClient({ region: "eu-west-3" });
export const CloudwatchClient = new CloudWatch.CloudWatchLogsClient({
  region: "eu-west-3",
});

const mybucket = "mybucketregli";

export const mainRouter = new Router()
  .get("/", async (req) => {
    const user = await getUserFromSession(req);
    console.log(user);
    return (
      <BaseHtml class="bg-background">
        <nav class="flex h-16 border-b bg-plain px-6">
          <div class="mx-auto flex w-full max-w-5xl items-center">
            <a href="/" class="text-xl font-bold uppercase">
              Logo
            </a>
            <div class="hidden w-full sm:flex">
              <nav class="ml-8 mr-auto flex items-center gap-4 text-sm font-medium">
                <a href="#">Pricing</a>
                <a href="#">Docs</a>
                <a href="#">Blog</a>
              </nav>
              <div class="flex items-center">
                {user ? (
                  <Button variant="outline" href="/dashboard">
                    Dashboard
                  </Button>
                ) : (
                  <Button variant="outline" href="/auth/sign-in">
                    Sign In
                  </Button>
                )}
              </div>
            </div>
            <div class="group ml-auto block sm:hidden">
              <button
                onclick="document.querySelector('#menu').checked = !document.querySelector('#menu').checked"
                class="flex size-10 cursor-pointer items-center justify-center rounded-md">
                <input type="checkbox" id="menu" class="hidden" />
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="group-has-[:checked]:hidden">
                  <path
                    d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"></path>
                </svg>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="hidden group-has-[:checked]:block">
                  <path
                    d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"></path>
                </svg>
              </button>
              <div class="fixed left-0 top-16 hidden h-[calc(100%-4rem)] w-full flex-col bg-white group-has-[:checked]:flex">
                <nav class="flex flex-col p-6 text-sm font-medium">
                  <a href="#" class="w-full border-b py-2">
                    Pricing
                  </a>
                  <a href="#" class="w-full border-b py-2">
                    Docs
                  </a>
                  <a href="#" class="w-full border-b py-2">
                    Blog
                  </a>
                </nav>
                <div class="mt-auto border-t p-4">
                  <Button
                    href="/auth/sign-in"
                    variant="outline"
                    className="w-full">
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <a href="/auth/logout">Logout</a>
        <form
          hx-post="/file"
          hx-encoding="multipart/form-data"
          hx-swap="none"
          hx-replace-url="false">
          <input type="file" name="file" id="file" />
          <input type="text" name="delimiter" id="delimiter" />
          <button>Submit</button>
        </form>
      </BaseHtml>
    );
  })
  .post("/file", async (req) => {
    return "";

    // return "";

    // const formData = await req.formData();

    // const fileBlob = formData.get("file") as Blob;

    // const fileExtension = separateFileExtension(fileBlob.name)[1];

    // const fileArrayBuffer = await fileBlob.arrayBuffer();
    // const fileBuffer = Buffer.from(fileArrayBuffer);

    // try {
    //   const response = await S3Client.send(
    //     new S3.PutObjectCommand({
    //       Bucket: mybucket + "d",
    //       Key: crypto.randomUUID() + fileExtension,
    //       Body: fileBuffer,
    //     }),
    //   );

    //   const etag = response.ETag;

    //   console.log(etag);
    //   return "";
    // } catch (error) {
    //   console.log(error);
    //   return new Response("", { status: 400 });
    // }

    // const payload = JSON.stringify({ file: fileName }); // remplacez par la charge utile à envoyer à votre fonction Lambda

    // const responseLambda = await LambdaClient.send(
    //   new Lambda.InvokeCommand({
    //     FunctionName: "reglifunction",
    //     Payload: payload,
    //     ClientContext: Buffer.from(
    //       JSON.stringify({ userID: "123455" }),
    //     ).toString("base64"),
    //   }),
    // );

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

    // await new Promise((resolve) => setTimeout(resolve, 10000));

    // const responseCloudWatch = await CloudwatchClient.send(
    //   new FilterLogEventsCommand({
    //     logGroupName,
    //     filterPattern: `"REPORT RequestId: ${requestId}"`,
    //     startTime: Date.now() - 3600000, // 1 hour ago
    //     endTime: Date.now(),
    //   }),
    // );

    //   console.log(responseCloudWatch);

    //   return "Nice";
    // } catch (error) {
    //   console.log(error);
    //   return "Not nice";
    // }
  });
