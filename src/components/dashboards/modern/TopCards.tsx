import NextLink from "next/link";
import Image from "next/image";
import { Box, CardContent, Grid, Typography } from "@mui/material";

import icon1 from "../../../../public/images/svgs/icon-connect.svg";
import icon2 from "../../../../public/images/svgs/icon-user-male.svg";
import icon5 from "../../../../public/images/svgs/icon-favorites.svg";
import icon6 from "../../../../public/images/svgs/icon-speech-bubble.svg";
import icon3 from "../../../../public/images/svgs/parents-icon.svg";
import icon7 from "../../../../public/images/svgs/icon-briefcase.svg";

const topcards = [
  {
    href: "/app/teachers",
    icon: icon6,
    title: "Total HR-Admins",
    digits: "40",
    bgcolor: "warning",
    keyName: 'totalTeachers'
  },
  {
    href: "/app/students",
    icon: icon2,
    title: "Total Employees",
    digits: "40",
    bgcolor: "primary",
    keyName: 'totalStudents'
  },
  {
    href: "/app/parents",
    icon: icon3,
    title: "Total Supervisors",
    digits: "256",
    bgcolor: "warning",
    keyName: 'totalParents'
  },
  {
    href: "/app/subjects",
    icon: icon5,
    title: "Total Subjects",
    digits: "112",
    bgcolor: "info",
    keyName: 'totalSubjects'
  },
  {
    href: "/app/quizzes",
    icon: icon6,
    title: "Total Quizzes",
    digits: "96",
    bgcolor: "warning",
    keyName: 'totalQuizzes'
  },
  {
    href: "/app/subjects",
    icon: icon1,
    title: "Topics",
    digits: "48",
    bgcolor: "info",
    keyName: 'totalTopics'
  },
  {
    href: "/app/subjects",
    icon: icon7,
    title: "Lessons",
    digits: "48",
    bgcolor: "success",
    keyName: 'totalLessons'
  },
];

const TopCards = ({
  analytics
}: any) => {
  return (
    <Grid container spacing={3} mt={3}>
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={2} key={i}>
          <NextLink href={topcard.href}>
            <Box bgcolor={topcard.bgcolor + ".light"} textAlign="center">
              <CardContent>
                <Image src={topcard.icon} alt={"topcard.icon"} width="50" />
                <Typography
                  color={topcard.bgcolor + ".main"}
                  mt={1}
                  variant="subtitle1"
                  fontWeight={600}
                >
                  {topcard.title}
                </Typography>
                <Typography
                  color={topcard.bgcolor + ".main"}
                  variant="h4"
                  fontWeight={600}
                >
                  {analytics[topcard.keyName]}
                </Typography>
              </CardContent>
            </Box>
          </NextLink>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
