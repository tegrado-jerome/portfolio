// Timeline entries, oldest first. Replace every [PLACEHOLDER].
// Icons: browse https://fontawesome.com/search?ic=free and import the ones you want.
import {
  faBriefcase,
  faGraduationCap,
  faLocationDot,
  faSeedling,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

export interface Experience {
  year: string;
  title: string;
  description: string;
  icon?: IconDefinition;
}

export const experience: Experience[] = [
  { year: "[YEAR]", title: "Beginning", description: "[SHORT DESCRIPTION]", icon: faSeedling },
  { year: "[YEAR]", title: "[EXPERIENCE]", description: "[SHORT DESCRIPTION]", icon: faBriefcase },
  { year: "[YEAR]", title: "[EDUCATION]", description: "[SHORT DESCRIPTION]", icon: faGraduationCap },
  { year: "[YEAR]", title: "[EXPERIENCE]", description: "[SHORT DESCRIPTION]", icon: faBriefcase },
  { year: "[YEAR]", title: "Now", description: "[SHORT DESCRIPTION]", icon: faLocationDot },
];
