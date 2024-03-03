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
    const invoices = [
      {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
      },
      {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
      },
      {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
      },
      {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
      },
      {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
      },
      {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
      },
      {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
      },
    ];

    return (
      <BaseHtml class="bg-body">
        <button onclick="document.querySelector('html').classList.toggle('dark')">
          Switch theme
        </button>
        <Table className="max-w-xl">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colspan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div class="m-4 space-x-4 space-y-4">
          <Badge>Hello badge</Badge>
          <Badge variant="secondary">Hello badge</Badge>
          <Badge variant="destructive">Hello badge</Badge>
          <Badge variant="outline">Hello badge</Badge>
        </div>
        <div class="m-4 space-x-4 space-y-4">
          <Button>Hello badge</Button>
          <Button variant="secondary" size="sm">
            Hello badge
          </Button>
          <Button variant="destructive" size="lg">
            Hello badge
          </Button>
          <Button variant="outline" size="icon">
            H
          </Button>
          <Button variant="ghost" size="sm">
            Hello badge
          </Button>
          <Button variant="link" size="sm">
            Hello badge
          </Button>
        </div>
        <Separator />
        <div>
          <Button disabled>Hello badge</Button>
          <Button variant="secondary" size="sm" disabled>
            Hello badge
          </Button>
          <Button variant="destructive" size="lg" disabled>
            Hello badge
          </Button>
          <Button variant="outline" size="icon" disabled>
            H
          </Button>
          <Separator orientation="vertical" />
          <Button variant="ghost" size="sm" disabled>
            Hello badge
          </Button>
          <Separator orientation="vertical" />
          <Button variant="link" size="sm" disabled>
            Hello badge
          </Button>
        </div>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div class="grid w-full items-center gap-4">
                <div class="flex flex-col space-y-1.5">
                  <Label for="name">Name</Label>
                  <Input id="name" placeholder="Name of your project" />
                </div>
                <div class="flex flex-col space-y-1.5">
                  <Label for="framework">Framework</Label>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
        <div class="w-max">
          <div class="space-y-1">
            <h4 class="text-sm font-medium leading-none">Radix Primitives</h4>
            <p class="text-muted-foreground text-sm">
              An open-source UI component library.
            </p>
          </div>
          <Separator className="my-4" />
          <div class="flex h-5 items-center space-x-4 text-sm">
            <div>Blog</div>
            <Separator orientation="vertical" />
            <div>Docs</div>
            <Separator orientation="vertical" />
            <div>Source</div>
          </div>
        </div>
        <ChevronDownIcon />
        <InputGroup>
          <Label>Name</Label>
          <Input />
          <InputError>There's an error</InputError>
        </InputGroup>
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
