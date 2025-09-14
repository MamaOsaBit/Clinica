-- DropForeignKey
ALTER TABLE "public"."HoraMedica" DROP CONSTRAINT "HoraMedica_pacienteId_fkey";

-- AlterTable
ALTER TABLE "public"."HoraMedica" ALTER COLUMN "pacienteId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."HoraMedica" ADD CONSTRAINT "HoraMedica_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
