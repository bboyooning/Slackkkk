import useInput from '@hooks/useInput';
import axios from 'axios';
import React, { useCallback, useState, VFC } from 'react';
import { Link } from 'react-router-dom';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from './styles';


const SignUp = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, ,setPassword] = useInput('');
  const [passwordCheck, ,setPasswordCheck] = useInput(''); 
  const [mismatchError, setMismatchError] = useState(false); 
  const [signUpError, setSignUpError]= useState('');
  const [signUpSuccess, setSignUpSuccess]= useState(false);
  

  const onChangePassword = useCallback((e)=>{
    setPassword(e.target.value);
    setMismatchError(e.target.value !== passwordCheck);
  }, [passwordCheck]);

  const onChangePasswordCheck = useCallback((e)=>{
    setPasswordCheck(e.target.value);
    setMismatchError(e.target.value !== password);
  }, [password]);
  
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if(!mismatchError && nickname){
      console.log('서버로 회원가입 하기')
      setSignUpError(''); // (로딩 단계) 각 요청별로 다른 응답을 보여줘야 하면, 아래와 같이 비동기 요청 하기전에 초기화를 해주는 것이 좋음
      setSignUpSuccess(false); // 마찬가지로 초기화!
      // axios.post('http://localhost:3095/api/users', { // localhost:3090 -> :3095 에게 보내는 것
      axios.post('/api/users', { // localhost:3095 -> localhost:3095 에게 보낸 것처럼 됨
        email,
        nickname,
        password
      })
        .then((response)=>{ 
          console.log(response);
          setSignUpSuccess(true);
        })
        .catch((error)=>{ 
          console.log(error.response);
          setSignUpError(error.response.data); 
        })
        .finally(()=>{});
    }
  }, 
  [email, nickname, password, passwordCheck, mismatchError]);
  
  
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  )
}

export default SignUp;