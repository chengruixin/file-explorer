import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  verticalMargin: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },

  subInfo: {
    display: 'flex',
    justifyContent: 'center',
  },
  flexGrow: {
    flexGrow: 1,
  },

  shallowText: {
    color: '#757575',
  },

  description: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
}))
