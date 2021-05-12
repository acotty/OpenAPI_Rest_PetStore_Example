import * as appRoot  from "app-root-path";
import * as path from "path";
import * as yaml from "yamljs";

export default yaml.load(path.join(appRoot.toString(), "src/contract", "PetStore_oas3.yaml"));
