import { Editor } from '@tinymce/tinymce-react';

const EditorDescription = ({ valueLabel, handleChange, value, messageError }) => {

  return (
    <div className='mb-2'>
      <label>{valueLabel}
      <Editor apiKey='9shht2i12dxqt5he8ogbn47gar7bpodknwyg553bd99ufd3a'
        onEditorChange={(content, editor) => {
          handleChange(content)
        }}
        value={value} 
        init={{
          height: 250,
          menubar: false,
          plugins: "advlist autolink lists link",
          toolbar: 'undo redo |  | ' +
          'bold italic ' +
          'bullist numlist | ' +
          'removeformat',
          content_style: 'body { font-size:14px }'
      }} />
      </label>
      {messageError && (<small className="invalid-feedback d-block fw-bold" >{messageError}</small>)}
    </div>
  )
}

export default EditorDescription;