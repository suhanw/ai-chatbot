import { useTheme } from "@mui/material/styles";

function BenderIcon({ style }: any) {
  const theme = useTheme();
  return (
    // <?xml version="1.0" encoding="utf-8"?>
    // <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    // <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="40px"
      height="40px"
      viewBox="0 0 1024 1024"
      style={{
        display: "inline-block",
        flexShrink: 0,
        marginRight: "5px",
        marginLeft: "-5px",
        fill: theme.palette.primary.contrastText,
        ...style,
      }}
    >
      <g id="bender-icon"></g>
      <path d="M512.001 0c29.766 0 53.894 24.128 53.894 53.894 0 22.138-20.084 41.16-39.17 49.454l14.47 139.192c103.142 1.204 186.382 85.192 186.382 188.618l0.002 80.842h-26.95c59.532 0 107.79 48.26 107.79 107.79v53.894c0 59.53-48.254 107.786-107.782 107.79h26.942v204.808c-49.166 22.906-127.428 37.718-215.578 37.718s-166.414-14.812-215.578-37.718v-204.808h26.94c-59.526-0.002-107.782-48.26-107.782-107.79v-53.894c0-59.53 48.258-107.79 107.79-107.79h-26.948v-80.842c0-103.426 83.24-187.414 186.384-188.618l14.47-139.192c-19.086-8.294-39.17-27.316-39.17-49.454 0-29.766 24.128-53.894 53.894-53.894zM700.631 538.95h-377.264c-44.646 0-80.842 36.194-80.842 80.842v53.894c0 44.646 36.196 80.842 80.842 80.842h377.264c44.646 0 80.842-36.196 80.842-80.842v-53.894c0-44.65-36.196-80.842-80.842-80.842zM512.001 815.158l-26.948-6.346v53.504h53.894v-53.504l-26.948 6.346zM700.631 862.316c0.002-53.894-20.556-45.19-53.892-54.018v54.018h53.892zM565.897 810.062v52.254h53.894v-53.002l-53.894 0.75zM404.213 809.314v53.002h53.894v-52.254l-53.894-0.75zM323.371 862.316h53.894v-54.018c-33.34 8.828-53.894 0.124-53.894 54.018zM512.001 943.158l26.948-0.614v-53.28h-53.894v53.28l26.948 0.614zM691.135 889.264h-44.396v32.164c21.334-9.138 35.854-20.38 44.396-32.164zM565.897 889.264v51.264c20.498-2.14 38.408-5.506 53.894-9.782v-41.482h-53.894zM404.213 889.264v40.422h-3.73c16.322 4.786 35.458 8.528 57.624 10.844v-51.264h-53.894zM332.863 889.264c8.546 11.784 23.064 23.026 44.402 32.164v-32.164h-44.402zM377.265 619.79h53.894v53.894h-53.894v-53.894zM592.843 619.79h53.894v53.894h-53.894v-53.894zM323.367 565.898h32.234c-27.39 16.502-45.706 46.532-45.706 80.84 0 34.31 18.318 64.34 45.71 80.844h-32.24c-29.764 0-53.894-24.132-53.894-53.894v-53.894c0-29.766 24.132-53.894 53.894-53.894zM700.631 565.898c29.764 0 53.894 24.128 53.894 53.894v53.894c0 29.764-24.132 53.894-53.894 53.894h-32.234c27.392-16.506 45.71-46.536 45.71-80.844 0-34.306-18.318-64.336-45.706-80.84h32.23zM452.817 727.582c27.392-16.506 45.71-46.536 45.71-80.844 0-34.306-18.318-64.336-45.706-80.84h118.358c-27.39 16.502-45.706 46.532-45.706 80.84 0 34.31 18.318 64.34 45.71 80.844h-118.37z"></path>
    </svg>
  );
}

export default BenderIcon;
