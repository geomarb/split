import React, { useMemo } from "react";
import BoardType from "../../../types/board/board";
import CopyIcon from "../../icons/CopyIcon";
import Flex from "../../Primitives/Flex";
import Separator from "../../Primitives/Separator";
import Text from "../../Primitives/Text";
import Tooltip from "../../Primitives/Tooltip";
import CardAvatars from "../CardAvatars";
import DeleteBoard from "../DeleteBoard";
import CountCards from "./CountCards";

type CardEndProps = {
  board: BoardType;
  isDashboard: boolean;
  isSubBoard: boolean | undefined;
  index: number | undefined;
  userIsAdmin: boolean;
  userId: string;
};

const CardEnd = React.memo(
  ({ board, isDashboard, isSubBoard, index, userIsAdmin, userId }: CardEndProps) => {
    const { _id: id, title, columns, users, team, createdBy } = board;

    const boardTypeCaption = useMemo(() => {
      if (isSubBoard && !isDashboard) return "Responsible";
      if (isSubBoard && !team && isDashboard) return "Team";
      if (team) return "Team";
      return "Personal";
    }, [isDashboard, isSubBoard, team]);

    const boardOwnerName = useMemo(() => {
      if (team) {
        return team?.name;
      }
      if (isSubBoard && isDashboard && index !== undefined) {
        return `sub-team ${index + 1}`;
      }
      if (isSubBoard && !isDashboard) {
        return users.find((user) => user.role === "responsible")?.user.firstName;
      }

      return createdBy?.firstName;
    }, [team, isSubBoard, isDashboard, createdBy?.firstName, index, users]);

    if (isDashboard) {
      return (
        <Flex align="center" css={{ justifySelf: "end" }}>
          <Text size="sm" color="primary300">
            {boardTypeCaption} |
          </Text>
          <Text css={{ mx: "$8" }} size="sm" weight="medium" color="primary800">
            {boardOwnerName}
          </Text>
          <CardAvatars
            listUsers={!team ? users : team.users}
            responsible={false}
            teamAdmins={false}
            userId={userId}
          />
        </Flex>
      );
    }

    if (!isDashboard) {
      return (
        <Flex css={{ alignItems: "center" }}>
          {isSubBoard && (
            <Flex align="center" gap="8">
              <Text size="sm" color="primary300">
                Responsible
              </Text>
              <CardAvatars
                listUsers={!team ? users : team.users}
                responsible
                teamAdmins={false}
                userId={userId}
              />
            </Flex>
          )}
          <CountCards columns={columns} />
          {userIsAdmin && !isSubBoard && (
            <Flex css={{ ml: "$24" }} gap="24" align="center">
              <Separator
                orientation="vertical"
                css={{ ml: "$8", backgroundColor: "$primary300", height: "$24 !important" }}
              />
              <Tooltip content="Duplicate board">
                <Flex pointer onClick={() => console.log("DUPLICATE")}>
                  <CopyIcon />
                </Flex>
              </Tooltip>
              <DeleteBoard boardId={id} boardName={title} />
            </Flex>
          )}
        </Flex>
      );
    }
    return null;
  }
);

export default CardEnd;