import React, { ReactNode, useState } from 'react';
import {
  Autocomplete,
  Box,
  Checkbox,
  ListItemText,
  MenuItem,
  Radio,
  Select,
  TextField,
  Stack,
  IconButton,
  Popover,
  useTheme,
  Tooltip,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

import { InfoIcon, X } from "lucide-react"
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import isArrayWithValues from '@/utils/isArrayWithValues';

const StyledAutocompletePaper = styled(Paper)(() => ({
  borderRadius: '0.75rem',
  overflow: 'hidden',
  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',
  border: '0.25px solid rgb(184, 182, 182)',
}));

const FormFields = ({
  label,
  onChange = () => { },
  options = [],
  value: _value = '',
  textFieldProps,
  type = 'text',
  labelRight,
  sx = {},
  error,
  helperText,
  backgroundColor,
  tooltip,
  inputFieldProps,
  helperTextProps,
}) => {
  const theme = useTheme();
  const mainBackgroundColor = backgroundColor ?? theme.palette.background.paper;
  const value = _value;

  const [anchorEl, setAnchorEl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Stack sx={sx}>
        {(label || labelRight) && (
          <Stack direction="column" alignItems="flex-start" sx={{ gap: 1, width: '100%' }}>
            {(label || tooltip) && (
              <Stack direction="row" alignItems="center" sx={{ gap: 1, width: '100%' }}>
                {label && (
                  <Typography
                    variant={'xlMedium'}
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#374151',
                      display: 'block',
                      width: '100%',
                      lineHeight: '1.25rem',
                    }}
                    {...inputFieldProps}
                  >
                    {label}
                  </Typography>
                )}
                {tooltip && (
                  <Tooltip title={tooltip}>
                    <InfoIcon height={18} width={18} />
                  </Tooltip>
                )}
              </Stack>
            )}

            {labelRight && labelRight}
          </Stack>
        )}
        {type === 'text' && (
          <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            sx={{ mt: 1 }}
            fullWidth
            InputProps={{
              style: {
                height: '2.375rem',
                backgroundColor: mainBackgroundColor,
                borderRadius: '0.625rem',
              },
            }}
            error={error}
            {...textFieldProps}
          />
        )}
        {type === 'number' && (
          <TextField
            size="small"
            onChange={(e) => onChange(e.target.value)}
            sx={{ mt: 1 }}
            fullWidth
            type="number"
            InputProps={{
              style: {
                height: '2.375rem',
                backgroundColor: mainBackgroundColor,
                borderRadius: '0.625rem',
              },
            }}
            error={error}
            value={value}
            {...textFieldProps}
          />
        )}
        {type === 'textarea' && (
          <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            sx={{
              mt: 1,
              width: '100%',
              '& .MuiInputBase-root': {
                width: '100%',
                minHeight: '120px'
              }
            }}
            fullWidth
            multiline
            rows={4}
            InputProps={{
              style: {
                backgroundColor: mainBackgroundColor,
                borderRadius: '0.625rem',
                width: '100%',
                minHeight: '120px'
              },
            }}
            error={error}
            {...textFieldProps}
          />
        )}
        {type === 'dropdown' && (
          <Select
            value={value || ''}
            size="small"
            onChange={(e) => onChange(e.target.value)}
            sx={{
              mt: 1,
              height: '2.375rem',
              borderRadius: '0.625rem',
              overflow: 'hidden',
              backgroundColor: mainBackgroundColor,
            }}
            fullWidth
            SelectDisplayProps={{
              style: {
                backgroundColor: mainBackgroundColor,
                borderRadius: '0.625rem',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '0.5rem',
                  boxShadow: '0px 0px 2px 0px rgba(0, 0, 0, 0.40)',
                  backgroundColor: '#fff',
                  border: '0.25px solid rgb(184, 182, 182)',
                },
              },
            }}
            {...textFieldProps}
          >
            {isArrayWithValues(options) ? (
              options?.map((i, index) => (
                <MenuItem
                  key={index}
                  value={i.value}
                  disabled={i?.disableProps?.disable || false}
                  sx={{
                    cursor: i?.disableProps?.disable
                      ? 'not-allowed'
                      : 'pointer',
                    padding: '0.4rem 1.1rem',
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    width={'100%'}
                  >
                    <Typography sx={{ fontSize: '0.9rem' }}>{i.label}</Typography>
                    <Typography variant="lRegular">
                      {i?.disableProps?.disableText}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                <Typography>No options available</Typography>
              </MenuItem>
            )}
          </Select>
        )}
        {type === 'date' && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              value={value ? dayjs(value) : null}
              format="DD/MM/YYYY"
              onChange={(newValue) => {
                const dayjsObject = dayjs(newValue);
                const unixTimestamp = dayjsObject.unix();
                onChange(new Date(unixTimestamp * 1000));
              }}
              autoFocus={false}
              slotProps={{
                textField: {
                  sx: {
                    width: '100%',
                    borderRadius: '0.625rem',
                    marginTop: '0.5rem',
                    fieldset: { borderRadius: '0.625rem' },
                    '[`.${OutlinedInputClasses.root}`] .MuiOutlinedInput-root': {
                      height: '36px',
                    },
                    '& .MuiInputLabel-root': {
                      lineHeight: 3,
                    },
                  },
                },
                inputAdornment: {
                  position: 'start',
                },
                popper: {
                  sx: {
                    zIndex: 9999,
                  },
                },
              }}
              {...textFieldProps}
            />
          </LocalizationProvider>
        )}
        {type === 'time' && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopTimePicker
              value={value ? dayjs(value) : null}
              onChange={(newValue) => {
                const dayjsObject = dayjs(newValue);
                const unixTimestamp = dayjsObject.unix();
                onChange(new Date(unixTimestamp * 1000));
              }}
              slotProps={{
                textField: {
                  sx: {
                    width: '100%',
                    borderRadius: '0.625rem',
                    marginTop: '0.5rem',
                    fieldset: { borderRadius: '0.625rem' },
                    '[`.${OutlinedInputClasses.root}`] .MuiOutlinedInput-root': {
                      height: '36px',
                    },
                    '& .MuiInputLabel-root': {
                      lineHeight: 3,
                    },
                  },
                },
                inputAdornment: {
                  position: 'start',
                },
              }}
              {...textFieldProps}
            />
          </LocalizationProvider>
        )}
        {type === 'datetime' && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDateTimePicker
              value={value ? dayjs(value) : null}
              onChange={(newValue) => onChange(newValue)}
              format="DD/MM/YYYY hh:mm A"
              slotProps={{
                textField: {
                  sx: {
                    width: '100%',
                    borderRadius: '0.625rem',
                    marginTop: '0.5rem',
                    fieldset: { borderRadius: '0.625rem' },
                    '[`.${OutlinedInputClasses.root}`] .MuiOutlinedInput-root': {
                      height: '36px',
                    },
                    '& .MuiInputLabel-root': {
                      lineHeight: 3,
                    },
                  },
                },
                inputAdornment: {
                  position: 'start',
                },
              }}
              {...textFieldProps}
            />
          </LocalizationProvider>
        )}
        {type === 'checkbox' && (
          <Autocomplete
            multiple
            options={options}
            disableCloseOnSelect
            getOptionLabel={(option) => option?.label}
            value={value || []}
            size="small"
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            sx={{ mt: label ? '0.5rem' : 0 }}
            isOptionEqualToValue={(option, value) => {
              return option.value === value.value;
            }}
            renderOption={(props, option) => (
              <li {...props}>
                <Checkbox
                  disableRipple
                  // icon={<UncheckedCheckboxIcon />}
                  // checkedIcon={<CheckedCheckboxIcon />}
                  style={{ marginRight: 8 }}
                  checked={value.some((it) => it?.value === option?.value)}
                />
                {option.label}
              </li>
            )}
            PaperComponent={StyledAutocompletePaper}
            ListboxProps={{
              sx: {
                maxHeight: 300,
                overflowY: 'auto',
                borderRadius: '0.75rem',
                boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',
                border: '0.25px solid rgb(184, 182, 182)',
                backgroundColor: '#fff',

                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: theme.palette.grey[100],
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.grey[400],
                  borderRadius: '10px',
                  border: `2px solid ${theme.palette.grey[400]}`,
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: theme.palette.grey[600],
                },
              },
            }}
            {...textFieldProps}
            renderInput={(params) => (
              <TextField
                multiline
                rows={1}
                {...params}
                InputProps={{
                  ...params.InputProps,
                  style: {
                    backgroundColor: mainBackgroundColor,
                    borderRadius: '0.625rem',
                    ...params.InputProps,
                  },
                }}
                {...textFieldProps}
              />
            )}
          />
        )}
        {type === 'radio' && (
          <Select
            size="small"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            sx={{ mt: 1, borderRadius: '0.625rem' }}
            fullWidth
            SelectDisplayProps={{
              style: { backgroundColor: mainBackgroundColor },
            }}
            renderValue={(selected) => selected}
            {...textFieldProps}
          >
            {options?.map((i) => (
              <MenuItem key={i.value} value={i.value}>
                <Radio
                  disableRipple
                  // icon={<UncheckedRadioIcon />}
                  // checkedIcon={<CheckedRadioIcon />}
                  checked={i.value === value}
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                />
                <ListItemText primary={i.label} />
              </MenuItem>
            ))}
          </Select>
        )}
        {type === 'autocomplete' && (
          <Autocomplete
            multiple
            options={options}
            disableCloseOnSelect
            getOptionLabel={(option) => option?.label}
            value={value || []}
            size="small"
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            sx={{ mt: label ? '0.5rem' : 0 }}
            isOptionEqualToValue={(option, value) => {
              return option.value === value.value;
            }}
            renderOption={(props, option) => (
              <li {...props}>{option.label}</li>
            )}
            {...textFieldProps}
            renderInput={(params) => (
              <TextField
                multiline
                rows={1}
                {...params}
                InputProps={{
                  ...params.InputProps,
                  style: {
                    backgroundColor: mainBackgroundColor,
                    borderRadius: '0.625rem',
                    ...params.InputProps,
                  },
                }}
                {...textFieldProps}
              />
            )}
          />
        )}
        {type === 'single_solo_autocomplete' && (
          <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option?.label
            }
            value={value || null}
            size="small"
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                onChange({ label: newValue, value: newValue });
              } else if (newValue && newValue.inputValue) {
                onChange({
                  label: newValue.inputValue,
                  value: newValue.inputValue,
                });
              } else {
                onChange(newValue);
              }
            }}
            onInputChange={(event, newInputValue) => {
              if (event && event.type === 'change') {
                onChange({ label: newInputValue, value: newInputValue });
              }
            }}
            sx={{ mt: label ? '0.5rem' : 0 }}
            isOptionEqualToValue={(option, value) => {
              return option.value === value.value;
            }}
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
            {...textFieldProps}
            renderInput={(params) => (
              <TextField
                multiline
                rows={1}
                {...params}
                InputProps={{
                  ...params.InputProps,
                  style: {
                    backgroundColor: mainBackgroundColor,
                    borderRadius: '0.625rem',
                    ...params.InputProps,
                  },
                }}
                {...textFieldProps}
              />
            )}
          />
        )}
        {type === 'password' && (
          <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            sx={{ mt: 1 }}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              style: {
                height: '2.375rem',
                backgroundColor: mainBackgroundColor,
                borderRadius: '0.625rem',
              },
              endAdornment: (
                <IconButton
                  sx={{ margin: 0, padding: '0.125rem' }}
                  onClick={handleTogglePasswordVisibility}
                >
                  {showPassword ? (
                    <VisibilityOutlinedIcon
                      sx={{ height: '1.125rem', width: '1.125rem' }}
                    />
                  ) : (
                    <VisibilityOffOutlinedIcon
                      sx={{ height: '1.125rem', width: '1.125rem' }}
                    />
                  )}
                </IconButton>
              ),
            }}
            error={error}
            {...textFieldProps}
          />
        )}
        {type === 'date-range' && (
          <>
            <TextField
              value={
                value?.startDate && value?.endDate
                  ? `${format(
                    new Date(value.startDate),
                    'dd/MM/yyyy'
                  )} - ${format(new Date(value.endDate), 'dd/MM/yyyy')}`
                  : ''
              }
              size="small"
              sx={{ mt: 1 }}
              fullWidth
              InputProps={{
                style: {
                  height: '2.375rem',
                  backgroundColor: mainBackgroundColor,
                  borderRadius: '0.625rem',
                },
              }}
              error={error}
              {...textFieldProps}
              onClick={handleOpenPopover}
            // onClick={(e) => e.preventDefault()} // Prevent focus on the text field
            />
          </>
        )}
        {helperText && (
          <Typography
            variant="lRegular"
            sx={{
              color: error
                ? theme.colors.negative
                : theme.colors.light_text_color,
              mt: '0.25rem',
            }}
            {...helperTextProps}
          >
            {helperText}
          </Typography>
        )}
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ padding: '0.25rem 1rem' }}
          >
            <Typography variant="xlSemibold">Select date</Typography>

            <IconButton onClick={handleClosePopover} sx={{ padding: '0.3rem' }}>
              <Tooltip title="Close">
                <X />
              </Tooltip>
            </IconButton>
          </Stack>
          <DateRangePicker
            ranges={[
              {
                startDate: value?.startDate
                  ? new Date(value.startDate)
                  : new Date(),
                endDate: value?.endDate ? new Date(value.endDate) : new Date(),
                key: 'selection',
              },
            ]}
            locale={enUS}
            onChange={(ranges) => {
              const { startDate, endDate } = ranges.selection;
              onChange({ startDate, endDate });
            }}
            className="date-range-picker"
          />
        </Stack>
      </Popover>
    </>
  );
};

export default FormFields;
