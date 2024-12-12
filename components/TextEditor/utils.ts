import { $isAtNodeEnd } from '@lexical/selection'
import { RangeSelection } from 'lexical'

export function getSelectedNode(selection: RangeSelection | null) {
  const anchor = selection?.anchor
  const focus = selection?.focus
  const anchorNode = selection?.anchor.getNode()
  const focusNode = selection?.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection?.isBackward()
  if (isBackward) {
    if (!focus) {
      return null
    }
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    if (!anchor) {
      return null
    }
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode
  }
}
