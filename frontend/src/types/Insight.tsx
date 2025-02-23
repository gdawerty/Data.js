import { SvgIconComponent } from "@mui/icons-material";
import { VictoryChart } from "victory";
import { ReactElement } from "react";

type Insight = {
    title: string;
    description: ReactElement;
    icon: ReactElement;
    chart: ReactElement<typeof VictoryChart>;
}

export default Insight;