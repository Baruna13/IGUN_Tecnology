-- quota is unknown for most schools; store NULL instead of a placeholder.
ALTER TABLE "schools" ALTER COLUMN "quota" DROP NOT NULL;
