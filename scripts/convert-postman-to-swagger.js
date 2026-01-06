import postmanToOpenApi from "postman-to-openapi";
import path from "path";
import fs from "fs";

const postmanFile = path.join(process.cwd(), "postman/Electricity_Bills_API.postman_collection.json");
const outputFile = path.join(process.cwd(), "src/lib/swagger/swagger.json");

(async () => {
  try {
    const swagger = await postmanToOpenApi(postmanFile, null, { defaultTag: "API" });
    fs.writeFileSync(outputFile, swagger);
    console.log("Swagger generated → src/lib/swagger/swagger.json");
  } catch (err) {
    console.error(err);
  }
})();
