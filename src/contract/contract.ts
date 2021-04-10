import * as path from "path";
import * as yaml from "yamljs";

export default yaml.load(path.join(__dirname, "PetStore_oas3.yaml"));
