import z from "zod";
import { AurHelper, Pkg, Service } from "./config_utils";


export type Config = {
    aur_helper: AurHelper,
    packages: Pkg[];
    services: Service[];
}
