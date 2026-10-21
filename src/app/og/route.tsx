import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/data";

export const runtime = "nodejs";

const navy = "#123044";
const gold = "#b8894a";
const paper = "#fefdfb";
const ink = "#1b3344";

async function font(name: string) {
  const file = await readFile(new URL(`./fonts/${name}`, import.meta.url));
  return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
}

export async function GET() {
  const [playfair, montserrat, montserratSemi, logoFile] = await Promise.all([
    font("PlayfairDisplay-Bold.ttf"),
    font("Montserrat-Medium.ttf"),
    font("Montserrat-SemiBold.ttf"),
    readFile(new URL("../../../public/logocorral.png", import.meta.url)),
  ]);
  const logo = `data:image/png;base64,${logoFile.toString("base64")}`;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: paper,
        }}
      >
        <div style={{ display: "flex", height: 10, width: "100%", background: gold }} />
        <div style={{ display: "flex", flex: 1, width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 760,
              padding: "48px 64px 36px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: 7,
                  textTransform: "uppercase",
                  color: gold,
                }}
              >
                Inmobiliaria
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 22,
                  fontFamily: "Playfair",
                  fontSize: 84,
                  lineHeight: 0.92,
                  color: navy,
                }}
              >
                <div style={{ display: "flex" }}>Corral</div>
                <div style={{ display: "flex" }}>Business</div>
              </div>
              <div
                style={{
                  display: "flex",
                  width: 88,
                  height: 3,
                  marginTop: 28,
                  background: gold,
                }}
              />
              <div
                style={{
                  display: "flex",
                  marginTop: 22,
                  fontFamily: "Montserrat",
                  fontWeight: 500,
                  fontSize: 28,
                  color: ink,
                }}
              >
                {siteConfig.tagline}
              </div>
            </div>
            <img src={logo} width={228} height={171} />
          </div>
            <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 440,
              background: navy,
              padding: "52px 48px 44px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={label}>Oficina</div>
              <div style={place}>Cicero</div>
              <div style={detail}>Cantabria</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={label}>Actividad</div>
              <div style={place}>Toda España</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={label}>Teléfono</div>
              <div style={detail}>{siteConfig.phone}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Playfair", data: playfair, weight: 700, style: "normal" },
        { name: "Montserrat", data: montserrat, weight: 500, style: "normal" },
        { name: "Montserrat", data: montserratSemi, weight: 600, style: "normal" },
      ],
    },
  );

  image.headers.set("Cache-Control", "public, max-age=86400");
  return image;
}

const label = {
  display: "flex",
  fontFamily: "Montserrat",
  fontWeight: 600,
  fontSize: 16,
  letterSpacing: 5,
  textTransform: "uppercase" as const,
  color: gold,
};

const place = {
  display: "flex",
  marginTop: 10,
  fontFamily: "Playfair",
  fontSize: 48,
  lineHeight: 1,
  color: "#f7f4ee",
};

const detail = {
  display: "flex",
  marginTop: 8,
  fontFamily: "Montserrat",
  fontWeight: 500,
  fontSize: 26,
  color: "#f7f4ee",
};
