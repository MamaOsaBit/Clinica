/*
  Warnings:

  - You are about to drop the column `duracion` on the `HoraMedica` table. All the data in the column will be lost.
  - You are about to drop the column `hora` on the `HoraMedica` table. All the data in the column will be lost.
  - Added the required column `horaId` to the `HoraMedica` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."HoraMedica" DROP COLUMN "duracion",
DROP COLUMN "hora",
ADD COLUMN     "horaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Hora" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hora_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."HoraMedica" ADD CONSTRAINT "HoraMedica_horaId_fkey" FOREIGN KEY ("horaId") REFERENCES "public"."Hora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
