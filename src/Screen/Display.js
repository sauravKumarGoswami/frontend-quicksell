import React from "react";
import TicketColumn from "../Components/TicketColumn";
import AppBar from "@mui/material/AppBar";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Menu, MenuItem, Typography, Select } from "@mui/material";
import _ from "lodash";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SignalCellularAlt1BarIcon from "@mui/icons-material/SignalCellularAlt1Bar";
import SignalCellularAlt2BarIcon from "@mui/icons-material/SignalCellularAlt2Bar";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import PendingIcon from "@mui/icons-material/Pending";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import ContrastOutlinedIcon from "@mui/icons-material/ContrastOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const Display = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [grouping, setGrouping] = useState("User");
  const [ordering, setOrdering] = useState("Priority");
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupByUser, setGroupByUser] = useState([]);
  const [groupByPriority, setGroupByPriority] = useState([]);
  const [groupByStatus, setGroupByStatus] = useState([]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleChangeGroup = (event) => {
    setGrouping(event.target.value);
  };

  const handleChangeOrder = (event) => {
    setOrdering(event.target.value);
  };

  const setData = (data) => {
    setTickets(data.tickets);
    setUsers(data.users);
  };

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  useEffect(() => {
    const result = _.groupBy(tickets, ({ userId }) => userId);
    setGroupByUser(result);
    setGroupByPriority(_.groupBy(tickets, ({ priority }) => priority));
    setGroupByStatus(_.groupBy(tickets, ({ status }) => status));
  }, [tickets, users]);

  useEffect(() => {
    if (ordering === "Priority") {
      let x = groupByUser;
      for (let t of Object.keys(groupByUser)) {
        x[t].sort(function (a, b) {
          return a.priority - b.priority;
        });
      }
      setGroupByUser(x);
      for (let t of Object.keys(groupByStatus)) {
        groupByStatus[t].sort(function (a, b) {
          return a.priority > b.priority;
        });
      }
      setGroupByStatus(groupByStatus);
    }

  }, [ordering]);

  const priorityIcons = [
    <MoreHorizIcon
      sx={{ color: "gray", padding: "1.5%", marginRight: 1, borderRadius: 1 }}
    />,
    <SignalCellularAlt1BarIcon
      sx={{ color: "gray", padding: "1.5%", marginRight: 1, borderRadius: 1 }}
    />,
    <SignalCellularAlt2BarIcon
      sx={{ color: "gray", padding: "1.5%", marginRight: 1, borderRadius: 1 }}
    />,
    <SignalCellularAltIcon
      sx={{ color: "gray", padding: "1.5%", marginRight: 1, borderRadius: 1 }}
    />,
    <PriorityHighIcon
      sx={{
        color: "white",
        backgroundColor: "orange",
        padding: "1.5%",
        marginRight: 1,
        borderRadius: 1,
      }}
    />,
  ];

  const priorName = ["No Priority", "Low", "Medium", "High", "Urgent"];

  const StatusIcons = [
    <PendingIcon sx={{ color: "gray", margin: 1 }} />,
    <FiberManualRecordOutlinedIcon sx={{ color: "gray", margin: 1 }} />,
    <ContrastOutlinedIcon sx={{ color: "orange", margin: 1 }} />,
    <CheckCircleIcon sx={{ color: "purple", margin: 1 }} />,
    <CancelIcon sx={{ color: "gray", margin: 1 }} />,
  ];

  const statName = ["Backlog", "Todo", "In progress", "Done", "Cancelled"];

  const userNames = Object.keys(groupByUser);
  return (
    <Box>
      <AppBar position="fixed" sx={{ backgroundColor: "#fff" }}>
        <Toolbar>
          <Button
            id="display-icon"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="outlined"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
            startIcon={<TuneIcon />}
            sx={{
              width: "10%",
              color: "#000",
              borderColor: "#fff",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "#fff",
                borderColor: "#fff",
                boxShadow: 2,
              },
            }}
          >
            Display
          </Button>
          <Menu
            id="display-icon"
            anchorEl={anchorEl}
            open={open}
            onClose={(e) => setOpen(false)}
            sx={{ borderColor: "gray", borderRadius: "2%" }}
          >
            <MenuItem sx={{ width: "300px", height: "50px" }}>
              <Typography
                component="p"
                variant="p"
                sx={{ color: "gray", marginRight: "30%" }}
                gutterBottom
              >
                Grouping
              </Typography>
              <Select
                value={grouping}
                onChange={handleChangeGroup}
                sx={{ height: "40px", width: "45%", color: "black" }}
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Priority">Priority</MenuItem>
                <MenuItem value="Status">Status</MenuItem>
              </Select>
            </MenuItem>
            <MenuItem sx={{ width: "300px", height: "50px" }}>
              <Typography
                component="p"
                variant="p"
                sx={{ color: "gray", marginRight: "30%" }}
                gutterBottom
              >
                Ordering
              </Typography>
              <Select
                value={ordering}
                onChange={handleChangeOrder}
                sx={{ height: "40px", width: "45%" }}
              >
                <MenuItem value="Priority">Priority</MenuItem>
                <MenuItem value="Title">Title</MenuItem>
              </Select>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {grouping === "User" &&
          Object.keys(groupByUser).map((userId) => (
            <TicketColumn
              order={ordering}
              key={userId}
              tickets={groupByUser[userId]}
              users={users}
              isUser={true}
              size={groupByUser[userId].length}
              keyCol={userId.split("-")[1] - 1}
            />
          ))}
        {grouping === "Priority" &&
          Object.keys(groupByPriority).map((priority) => (
            <TicketColumn
              key={priority}
              order={ordering}
              tickets={groupByPriority[priority]}
              users={users}
              keyCol={priority}
              size={groupByPriority[priority].length}
              icons={priorityIcons}
              headings={priorName}
              isUser={false}
            />
          ))}
        {grouping === "Status" &&
          statName.map((status, index) => (
            <TicketColumn
              key={status}
              tickets={groupByStatus[status]}
              order={ordering}
              users={users}
              keyCol={index}
              size={groupByStatus[status] ? groupByStatus[status].length : 0}
              icons={StatusIcons}
              headings={statName}
              isUser={false}
            />
          ))}
      </Box>
    </Box>
  );
};

export default Display;
