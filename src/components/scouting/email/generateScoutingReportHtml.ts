import { getAliasesMapForScoutingAreas } from "../utils/scoutReportUtils";
import { getAliasSummaryText } from "../utils/scoutReportFormatting";
import { Asset } from "expo-asset";
import {
  downloadAsync,
  readAsStringAsync,
  cacheDirectory,
} from "expo-file-system";
import type { ScoutingReportForm } from "../types";
import type { ScoutingAppUser } from "../../../redux/user/types";

export const generateScoutingReportHtml = async (
  report: ScoutingReportForm,
  mapScreenshotBase64: string,
  scoutedBy: ScoutingAppUser
) => {
  const firstPageHtml = await generateFirstPageHtml(
    report,
    mapScreenshotBase64,
    scoutedBy
  );

  const imagesHtml = await generateImagesHtml(report);
  const output = `
  <html>
  ${generateHeadTag()}
  <body>
  ${firstPageHtml}
  <div class="images-page">
    ${imagesHtml}
  </div>
  </body>
  </html>
  `;

  // console.log(output, "output");
  return output;
};

/*
  This function is used to generate the head tag for the scouting report
  Includes the meta tags and the title, and style tag
*/
const generateHeadTag = () => {
  return `
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scouting Report</title>
    ${generateStyleTag()}
  </head>
  `;
};

const generateFirstPageHtml = async (
  report: ScoutingReportForm,
  mapScreenshotBase64: string,
  scoutedBy: ScoutingAppUser
) => {
  const logoSvgText = await getLogoSVGAsText();
  return `
  <div class="pdf-page">
    <div class="header">
      <div class="header-inline-block scout-report-title">
        <div class="header-inline-block svg">${logoSvgText}</div>
        <div class="header-inline-block">Scout Report</div>
      </div>
      <div class="header-inline-block field-title">
        ${report.field.Name}
      </div>
    </div>
    <div class="container">
      ${generateTextListHtml(report, scoutedBy)}
      ${generateMapHtml(mapScreenshotBase64)}
    </div>
    <div class="full-width-section">
      <p><strong>Comments:</strong></p>
      <div class="long-string-content">${report.summaryText}</div>
      <p><strong>Recommendations:</strong></p>
      <div class="long-string-content">${report.recommendations}</div>
    </div>
    ${generateFooterHtml()}
    </div>
  `;
};

const getLogoSVGAsText = async () => {
  // TODO: Check if the logo is available somewhere, otherwise load in the default logo
  const isCompanyLogoAvailable = false;
  let svgText = "";
  if (!isCompanyLogoAvailable) {
    const [{ localUri }] = await Asset.loadAsync(
      require("../../../../assets/gat.svg")
    );
    if (localUri) {
      const rawSvgText = await readAsStringAsync(localUri);
      svgText = rawSvgText;
    }
  }
  return svgText;
};
const generateMapHtml = (mapScreenshotBase64: string) => {
  const mapScreenshotUri = `data:image/jpg;base64,${mapScreenshotBase64}`;
  // this needs to be an image but instead of a link, we are getting the base 64 string
  return `
    <div class="map-image">
      <img src="${mapScreenshotUri}" alt="Map Screenshot" />
    </div>
    `;
};

const generateTextListHtml = (
  report: ScoutingReportForm,
  scoutedBy: ScoutingAppUser
) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  } as Intl.DateTimeFormatOptions;
  const autoSummary = generateAutoSummaryHtml(report);
  return `
  <div class="text-list">
    <ul class="report-properties">
    <li>
      <div class="list-value-title">
        <strong>Date:</strong>
      </div>
      <div class="list-value-content">
        ${report.scoutedDate.toLocaleDateString("en-US", options)}
      </div>
    </li>
    <li>
      <div class="list-value-title">
        <strong>Grower/Farm:</strong>
      </div>
      <div class="list-value-content">
        ${report.growerName + (report.farmName ? ` - ${report.farmName}` : "")}
      </div>
    </li>
    <li>
      <div class="list-value-title">
        <strong>Scouted By:</strong>
      </div>
      <div class="list-value-content">
        ${scoutedBy.FirstName + " " + scoutedBy.LastName}
      </div>
    </li>
    <li>
      <div class="list-value-title">
        <strong>Crop:</strong>
      </div> <div class="list-value-content">${report.crop.Name}</div>
    </li>
    <li>
      <div class="list-value-title">
        <strong>Field Area:</strong>
      </div> <div class="list-value-content">${report.fieldArea} ${
    report.fieldAreaUnit
  }</div>
    </li>
    <li>
      <div class="list-value-title">
        <strong>Growth Stage:</strong>
      </div> <div class="list-value-content">${report.growthStage}</div>
    </li>
    </ul>
    <div class="auto-summary-list">
      ${
        autoSummary.length > 0
          ? `<div class="list-value-title"><strong>Summary:</strong></div>`
          : ""
      }
      <ul>
        ${autoSummary}
      </ul>
    </div>
  </div>
  `;
};

const generateAutoSummaryHtml = (report: ScoutingReportForm) => {
  const aliasMap = getAliasesMapForScoutingAreas(report.scoutingAreas);
  const text = Object.keys(aliasMap).map((pestKey) => {
    const pestTypeSet =
      aliasMap[pestKey as "Weeds" | "Diseases" | "Insects" | "General"];
    const pestText = Object.keys(pestTypeSet).map((aliasName) => {
      const areas = pestTypeSet[aliasName];
      const areaString = Array.from(areas).join(", ");
      const aliasSummaryText = getAliasSummaryText(
        aliasName,
        areas.size,
        areaString
      );
      return `<li>${aliasSummaryText}</li>`;
    });
    return pestText;
  });
  return text.flat().join("");
};

const generateImagesHtml = async (report: ScoutingReportForm) => {
  const images = report.images;
  if (report.images.length === 0) {
    return "";
  }

  const imagesHtml = report.images.map(async (image) => {
    let stringifiedImage = "";
    // Stringify the image object to be able to pass it to the next page
    if (image.Url.includes("http")) {
      // We need to fetch the image from the URL
      const asset = await downloadAsync(
        image.Url,
        (cacheDirectory as string) + image.ID
      );
      stringifiedImage = await readAsStringAsync(asset.uri, {
        encoding: "base64",
      });
      // console.log("stringifiedImage", stringifiedImage);
    } else if (
      image.Url?.includes("file://") ||
      image.Url?.includes("content://")
    ) {
      stringifiedImage = await readAsStringAsync(image.Url, {
        encoding: "base64",
      });
    }
    stringifiedImage = `data:image/jpg;base64,${stringifiedImage}`;
    return `
    <div class="report-image">
      <img src="${stringifiedImage}" />
    </div>
    `;
  });
  const result = await Promise.all(imagesHtml);
  return result.join("");
};

const generateFooterHtml = () => {
  return `
  <footer>
    <div class="footer">
      <p>Powered by Grounded Agri-Tools</p>
    </div>
  </footer>
  `;
};

/*
  This function is used to generate the style tag for the scouting report
  Includes the styles for the header, container, text-list, map-image, and map-image img
*/
const generateStyleTag = () => {
  return `
  <style>
      body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
      }
      .pdf-page {
          padding: 20px;
          box-sizing: border-box;
          break-inside: avoid;
          border: 1px solid #f1f1f1;
      }
      .images-page {
        display: flex;
        padding: 20px;
        flex-wrap: wrap;
        break-inside: avoid;
      }
      .header {
          text-align: center;
          margin: 20px 0;
      }
      .header-inline-block {
        display: inline-block;
        text-align: left;
        font-weight: bold;
        
      }
      .svg {
        vertical-align: middle;
      }
      .field-title {
        width: 55%;
        font-size: 22px;
      }
      .scout-report-title {
        width: 44%;
        font-style: italic;
        font-size: 24px;
      }
      .container {
          display: flex;
          flex-wrap: wrap;
          padding: 0 20px;
      }
      .text-list {
          flex: 1;
          max-width: 50%;
          padding-right: 50px;
      }
      .text-list ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
      }
      .report-properties li {
        margin-bottom: 10px;
        padding-top: 2px;
        border-bottom: 1px solid lightgray;
      }
      .auto-summary-list ul {
          list-style-type: none;
      }
      .auto-summary-list li:nth-child(even) {
          background-color: lightgray;
      }
      .auto-summary-list li{
          padding-left: 10px;
          padding-bottom: 2px;
      }
      .map-image {
          height: 550px;
          max-width: 55%;
          text-align: center;
          border: 1px solid black;
      }
      .map-image img {
          width: 100%;
          height: 100%;
      }
      .report-image {
        height: 325px;
        width: 40%;
        text-align: center;
        padding: 10px;
      }
      .report-image img {
        width: 100%;
        height: 100%;
      }
      .full-width-section {
        width: 100%;
      }
      .footer {
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #f1f1f1;
        color: #333;
        text-align: center;
        padding: 10px 0;
        box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
    }
    .long-string-content {
      white-space: pre-line;
      word-wrap: break-word;
      padding-bottom: 10px;
    }
    .list-value-title {
      color: gray;
    }
    .list-value-content {
      text-align: left;
      padding: 6px;
    }
    
  </style>
  `;
};
