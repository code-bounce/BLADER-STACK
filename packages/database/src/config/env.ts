import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { resolve } from "path";
import { z, ZodError } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

// Load .env from root (go up from packages/database/src/config to root)
const envPath = resolve(__dirname, "../../../../.env");

// Load and expand .env
const myEnv = config({ path: envPath });
expand(myEnv);

// Validate
try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    console.error("❌ Missing required values in .env:");
    error.issues.forEach((issue) => {
      console.error(`  • ${String(issue.path[0])}: ${issue.message}`);
    });
    console.error(`\n📁 Looking for .env at: ${envPath}`);
    console.error(`💡 Make sure .env exists in project root\n`);

    const e = new Error("Environment validation failed");
    e.stack = "";
    throw e;
  } else {
    console.error(error);
    throw error;
  }
}

export const env = EnvSchema.parse(process.env);
export default env;
