import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useGetConversationList,
  useSetCurrentConversationId,
  useUpdateConversationTitle,
} from "../../store/conversations";
import { useCurrentUser } from "../../store/auth";

function ConversationPicker() {
  const { isLoggedIn } = useCurrentUser();
  const { conversationList } = useGetConversationList(isLoggedIn);

  if (!conversationList.length) {
    return (
      <>
        <Typography variant="h6" color="text.secondary" p="10px">
          Start a new chat!
        </Typography>
        <Typography variant="body2" color="text.secondary" p="10px">
          A history of our conversations will be listed here.
        </Typography>
      </>
    );
  }

  return (
    <List disablePadding>
      {conversationList?.map(({ _id, title }: any) => (
        <ConversationPickerItem key={_id} _id={_id} title={title} />
      ))}
    </List>
  );
}

function ConversationPickerItem({ title, _id }: any) {
  const [editMode, setEditMode] = useState<boolean>(false);
  return (
    <ListItem disablePadding>
      {editMode ? (
        <ItemEditMode
          _id={_id}
          title={title}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      ) : (
        <ItemSelectMode _id={_id} title={title} setEditMode={setEditMode} />
      )}
    </ListItem>
  );
}

function ItemEditMode({ _id, title, editMode, setEditMode }: any) {
  const [newTitle, setNewTitle] = useState<string>(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateConversationTitle } = useUpdateConversationTitle({
    conversationId: _id,
  });

  useEffect(() => {
    if (editMode) inputRef?.current?.select();
  }, [editMode]);

  const handleInputChange = (e: React.FocusEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setEditMode(false);
    if (e.target.value) {
      updateConversationTitle(e.target.value.trim());
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={newTitle}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      style={{
        all: "unset",
        width: "100%",
        boxSizing: "border-box",
        margin: "12px 16px",
        outline: "1px solid blue",
      }}
    />
  );
}

function ItemSelectMode({ _id, title, setEditMode }: any) {
  const theme = useTheme();
  const { currentConversationId, setCurrentConversationId } =
    useSetCurrentConversationId();
  const [displayMoreMenu, setDisplayMoreMenu] = useState(false);

  const isSelected = _id === currentConversationId;

  return (
    <ListItemButton
      onClick={() => {
        setCurrentConversationId(_id);
      }}
      onMouseEnter={() => setDisplayMoreMenu(true)}
      onMouseLeave={() => setDisplayMoreMenu(false)}
    >
      <ListItemText
        primary={title}
        sx={{
          "& .MuiListItemText-primary": {
            fontWeight: isSelected ? 600 : 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "&::after": {
              content: '""',
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 100,
              background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main})`,
            },
          },
        }}
      />
      {displayMoreMenu && (
        <MoreMenu
          _id={_id}
          setDisplayMoreMenu={setDisplayMoreMenu}
          setEditMode={setEditMode}
        />
      )}
    </ListItemButton>
  );
}

function MoreMenu({ setDisplayMoreMenu, setEditMode, _id }: any) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setDisplayMoreMenu(false);
  };
  const handleEditMode = () => {
    handleClose();
    setEditMode(true);
  };
  const handleDelete = () => {
    handleClose();
    console.log("deleting");
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          padding: 0,
          position: "absolute",
          right: "10px",
          color: theme.palette.primary.dark,
          background: theme.palette.primary.main,
          borderRadius: "4px",
          "&:hover": {
            color: theme.palette.primary.contrastText,
          },
        }}
      >
        <MoreHorizIcon sx={{}} />
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleEditMode}>
          <EditIcon sx={{ marginRight: "5px" }} />
          <small>Edit</small>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ marginRight: "5px" }} />
          <small>Delete</small>
        </MenuItem>
      </Menu>
    </>
  );
}

export default ConversationPicker;
