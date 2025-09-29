import { FC } from "react";
import { useSelector } from "../../../../store/Store";
import Link from "next/link";
import { styled } from "@mui/material";
import { AppState } from "../../../../store/Store";
import Image from "next/image";

const Logo = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "block",
    marginBottom: '10px'
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="/">
        {customizer.activeMode === "dark" ? (
          <Image
            src="/images/logos/classerly.png"
            alt="logo"
            height={customizer.TopbarHeight}
            width={174}
            priority
            style={{ marginTop: "5px", objectFit: "contain" }}
          />
        ) : (
          <Image
            src={"/images/logos/classerly.png"}
            alt="logo"
            height={customizer.TopbarHeight}
            width={174}
            priority
            style={{ marginTop: "5px", objectFit: "contain" }}
          />
        )}

        <h1>Classerly.com</h1>

      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/">
      {customizer.activeMode === "dark" ? (
        <Image
          src="/images/logos/classerly.png"
          alt="logo"
          height={customizer.TopbarHeight}
          width={174}
          priority
          style={{ marginTop: "5px", objectFit: "contain" }}
        />
      ) : (
        <Image
          src="/images/logos/classerly.png"
          alt="logo"
          height={customizer.TopbarHeight}
          width={174}
          priority
          style={{ marginTop: "5px", objectFit: "contain" }}
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
